from __future__ import annotations

import hashlib
import json
import logging
import uuid
import asyncio
from typing import Any

from celery import shared_task

from app.core.config import settings

logger = logging.getLogger(__name__)


def _redis_client():
    try:
        import redis

        return redis.from_url(settings.redis_url, decode_responses=True)
    except Exception:
        return None


def _set_status(task_id: str, status: str, payload: Any | None = None) -> None:
    r = _redis_client()
    if not r:
        return
    r.set(f"ai:task:{task_id}:status", status)
    if payload is not None:
        r.set(f"ai:task:{task_id}:result", json.dumps(payload))


def _get_status(task_id: str) -> dict[str, Any]:
    r = _redis_client()
    if not r:
        return {"status": "unknown"}
    status = r.get(f"ai:task:{task_id}:status") or "unknown"
    result = r.get(f"ai:task:{task_id}:result")
    if result:
        try:
            result = json.loads(result)
        except Exception:
            result = None
    return {"status": status, "result": result}


def _cache_get(hash_key: str):
    r = _redis_client()
    if not r:
        return None
    val = r.get(f"ai:cache:{hash_key}")
    if not val:
        return None
    try:
        return json.loads(val)
    except Exception:
        return None


def _cache_set(hash_key: str, value: Any, ttl: int = 3600):
    r = _redis_client()
    if not r:
        return
    try:
        r.set(f"ai:cache:{hash_key}", json.dumps(value), ex=ttl)
    except Exception:
        return


@shared_task(bind=True, name="generate_trip_plan")
def generate_trip_plan(self, task_id: str, input_hash: str, prompt_payload: dict[str, Any]) -> dict[str, Any]:
    """Celery task: call OpenAI, validate, cross-check listings, cache result."""
    _set_status(task_id, "running")

    # If cache exists, return immediately
    cached = _cache_get(input_hash)
    if cached:
        _set_status(task_id, "finished", cached)
        return cached

    # Two attempts: first call, validate JSON; if invalid, one retry
    attempts = 0
    final_result = None
    while attempts < 2 and final_result is None:
        attempts += 1
        try:
            # Prefer OpenAI SDK if available
            try:
                import openai

                resp_text = None
                if getattr(settings, "openai_api_key", None):
                    openai.api_key = settings.openai_api_key
                completion = openai.ChatCompletion.create(
                    model=prompt_payload.get("model", "gpt-4o-mini"),
                    messages=[{"role": "user", "content": prompt_payload.get("prompt", "")}],
                    max_tokens=800,
                )
                # Extract text
                resp_text = completion.choices[0].message.content
            except Exception:
                # Fallback to integrations client
                from app.integrations.openai_client import OpenAIClient

                client = OpenAIClient()
                resp = client.completion(prompt_payload.get("prompt", ""))
                # try to extract text
                resp_text = resp.get("choices", [{}])[0].get("text") or resp.get("choices", [{}])[0].get("message", {}).get("content")

            if not resp_text:
                raise ValueError("empty AI response")

            # Expect JSON body; try to parse
            parsed = json.loads(resp_text)

            # Validate against Pydantic model and then cross-check listing IDs
            from pydantic import BaseModel, Field, ValidationError

            class TripItem(BaseModel):
                listing_id: str
                day: int
                title: str
                description: str | None = None

            class TripPlan(BaseModel):
                name: str
                days: int
                items: list[TripItem]

            plan = TripPlan.parse_obj(parsed)

            # Cross-check listings exist in DB
            async def _validate_listings():
                from app.db.session import AsyncSessionLocal
                from app.models.listing import Listing
                from sqlalchemy import select

                async with AsyncSessionLocal() as session:
                    valid_items = []
                    for it in plan.items:
                        q = select(Listing).where(Listing.id == it.listing_id)
                        res = await session.execute(q)
                        if res.scalars().first() is not None:
                            valid_items.append(it.dict())
                    return valid_items

            valid_items = asyncio.run(_validate_listings())
            result_obj = {"name": plan.name, "days": plan.days, "items": valid_items}

            final_result = result_obj
            break
        except (json.JSONDecodeError, ValidationError, ValueError) as exc:
            logger.warning("AI response invalid on attempt %s: %s", attempts, exc)
            if attempts >= 2:
                _set_status(task_id, "failed", {"error": "invalid_ai_response"})
                return {"error": "invalid_ai_response"}
            continue
        except Exception as exc:  # unexpected
            logger.exception("AI planner unexpected error")
            _set_status(task_id, "failed", {"error": str(exc)})
            return {"error": str(exc)}

    if final_result is not None:
        _cache_set(input_hash, final_result)
        _set_status(task_id, "finished", final_result)
        return final_result

    _set_status(task_id, "failed", {"error": "unknown"})
    return {"error": "unknown"}
