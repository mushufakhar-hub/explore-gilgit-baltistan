from __future__ import annotations

import json
from collections.abc import Callable
from typing import Any

import httpx
import jwt
from fastapi import Depends, Request, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings
from app.core.exceptions import ForbiddenError, UnauthorizedError

security = HTTPBearer(auto_error=False)

_JWKS_CACHE: dict[str, Any] = {"value": None, "expires_at": 0.0}


def _get_jwks() -> dict[str, Any]:
    import time

    now = time.time()
    if _JWKS_CACHE["value"] is not None and now < _JWKS_CACHE["expires_at"]:
        return _JWKS_CACHE["value"]

    response = httpx.get(settings.clerk_jwks_url, timeout=10.0)
    response.raise_for_status()
    data = response.json()
    _JWKS_CACHE["value"] = data
    _JWKS_CACHE["expires_at"] = now + 300
    return data


def _get_key_by_kid(kid: str) -> dict[str, Any]:
    jwks = _get_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    raise UnauthorizedError("Unable to verify Clerk JWT: key not found")


async def get_current_user(request: Request) -> dict[str, Any]:
    credentials: HTTPAuthorizationCredentials | None = await security(request)
    if credentials is None or not credentials.credentials:
        raise UnauthorizedError("Missing bearer token")

    token = credentials.credentials
    try:
        import jwt
        from jwt import PyJWK
    except ImportError as exc:  # pragma: no cover
        raise UnauthorizedError("JWT library not available") from exc

    try:
        header = jwt.get_unverified_header(token)
        alg = header.get("alg", "RS256")
        # If token uses asymmetric signature (RS*), fetch JWK and verify
        if alg.upper().startswith("RS"):
            key_data = _get_key_by_kid(header.get("kid"))
            signing_key = PyJWK(key_data).key
            payload = jwt.decode(
                token,
                signing_key,
                algorithms=[alg],
                audience=None,
                issuer=settings.clerk_issuer,
                options={"require": ["sub", "exp", "iat"]},
            )
        else:
            # HMAC-based tokens: prefer a configured Clerk secret. In
            # testing mode only (explicit), allow unverified decode for
            # test tokens. In production, require the configured secret
            # and fail otherwise.
            secret = settings.clerk_secret_key
            if secret:
                payload = jwt.decode(
                    token,
                    secret,
                    algorithms=[alg],
                    audience=None,
                    issuer=settings.clerk_issuer if settings.clerk_issuer else None,
                    options={"require": ["sub", "exp", "iat"]},
                )
            else:
                # Only allow signature-less decoding when explicitly
                # enabled via `TESTING` config flag.
                if getattr(settings, "testing", False):
                    payload = jwt.decode(token, options={"verify_signature": False})
                else:
                    raise UnauthorizedError("Missing Clerk secret key; JWT cannot be verified")
    except Exception as exc:  # pragma: no cover - security boundary enforced here
        raise UnauthorizedError("Invalid Clerk JWT") from exc

    request.state.user = payload
    return payload


def require_roles(*roles: str) -> Any:
    def dependency(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        user_roles = set(user.get("roles", []))
        if not roles or not set(roles).intersection(user_roles):
            raise HTTPException(status_code=403, detail="Insufficient role privileges")
        return user

    return Depends(dependency)


def require_permission(permission: str) -> Any:
    def dependency(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        user_permissions = set(user.get("permissions", []))
        if permission not in user_permissions:
            raise HTTPException(status_code=403, detail=f"Missing required permission: {permission}")
        return user

    return Depends(dependency)
