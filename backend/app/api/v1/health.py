from __future__ import annotations

from fastapi import APIRouter

from app.integrations.circuit_breaker import RedisCircuitBreaker
from app.integrations.google_maps import GoogleMapsClient
from app.integrations.openai_client import OpenAIClient

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/")
async def health() -> dict[str, dict]:
    results: dict[str, dict] = {}

    # Google Maps
    gm_cb = RedisCircuitBreaker("google_maps")
    results["google_maps"] = {"circuit_open": gm_cb.is_open()}

    # OpenAI
    oa_cb = RedisCircuitBreaker("openai")
    results["openai"] = {"circuit_open": oa_cb.is_open()}

    # Redis availability (used by circuit breaker)
    try:
        import redis

        r = redis.from_url("redis://localhost:6379/0", decode_responses=True)
        r.ping()
        results["redis"] = {"ok": True}
    except Exception:
        results["redis"] = {"ok": False}

    return {"status": "ok", "dependencies": results}
