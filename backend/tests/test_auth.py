from __future__ import annotations

from typing import Any

import jwt
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.auth import get_current_user, require_permission, require_roles


@pytest.fixture
def app() -> FastAPI:
    # Enable testing mode so the auth module allows test HS256 tokens when
    # `clerk_secret_key` is not configured.
    from app.core.config import settings

    settings.testing = True

    app = FastAPI()

    @app.get("/protected")
    async def protected_route(user: dict[str, Any] = require_roles("admin")) -> dict[str, Any]:
        return {"ok": True, "user": user["sub"]}

    @app.get("/permission")
    async def permission_route(user: dict[str, Any] = require_permission("manage_users")) -> dict[str, Any]:
        return {"ok": True, "user": user["sub"]}

    return app


def test_require_roles_accepts_matching_role(app: FastAPI) -> None:
    token = jwt.encode({"sub": "user_123", "roles": ["admin"]}, "secret", algorithm="HS256")

    with TestClient(app) as client:
        response = client.get("/protected", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200


def test_require_permission_rejects_missing_permission(app: FastAPI) -> None:
    token = jwt.encode({"sub": "user_123", "permissions": ["view_users"]}, "secret", algorithm="HS256")

    with TestClient(app) as client:
        response = client.get("/permission", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 403
