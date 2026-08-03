from __future__ import annotations

import time
from typing import Callable

from fastapi import HTTPException, Request, Depends
import anyio

from app.core.config import settings


def _redis_client():
    try:
        import redis

        return redis.from_url(settings.redis_url, decode_responses=True)
    except Exception:
        return None


def rate_limiter(limit: int = 10, period: int = 60) -> Callable:
    """Return a FastAPI dependency that enforces a simple fixed-window rate limit.

    - `limit`: allowed requests per `period` seconds
    - `period`: window length in seconds
    """

    async def _dependency(request: Request) -> None:
        r = _redis_client()
        # If Redis isn't available, be permissive
        if r is None:
            return

        # Identify key by authenticated user id if present, otherwise by IP
        user_id = None
        try:
            # fast-path: some routes include a `user` in state or headers
            user = request.state.user if hasattr(request.state, "user") else None
            if user and isinstance(user, dict) and user.get("sub"):
                user_id = user.get("sub")
        except Exception:
            user_id = None

        if not user_id:
            # fallback to client IP
            client = request.client
            user_id = client.host if client else "anon"

        key = f"rl:{user_id}:{int(time.time() // period)}"

        def _incr():
            cur = r.incr(key)
            if cur == 1:
                r.expire(key, period)
            return int(cur)

        try:
            cur = await anyio.to_thread.run_sync(_incr)
        except Exception:
            # if redis fails, allow request
            return

        if cur > limit:
            raise HTTPException(status_code=429, detail="rate limit exceeded")

    return _dependency
