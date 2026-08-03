from __future__ import annotations

import hashlib
import json
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.db.session import get_db
from app.tasks.ai_planner import generate_trip_plan, _get_status

router = APIRouter(prefix="/ai", tags=["ai"])


class PlannerIn(BaseModel):
    origin: str
    days: int
    interests: list[str] | None = None
    budget: int | None = None


@router.post("/trip-plans")
async def create_trip_plan(payload: PlannerIn) -> dict[str, Any]:
    # Normalize input and compute hash for caching
    norm = {"origin": payload.origin.strip().lower(), "days": payload.days, "interests": payload.interests or [], "budget": payload.budget}
    h = hashlib.sha256(json.dumps(norm, sort_keys=True).encode("utf-8")).hexdigest()

    # Check cache quickly via Redis
    from app.tasks.ai_planner import _cache_get

    cached = _cache_get(h)
    if cached:
        return {"task_id": None, "cached": True, "result": cached}

    task_id = f"ai_{uuid.uuid4().hex[:12]}"
    # dispatch Celery task
    generate_trip_plan.delay(task_id, h, {"prompt": f"Create a {payload.days}-day trip from {payload.origin} for interests {payload.interests}", "model": "gpt-4o-mini"})
    return {"task_id": task_id, "cached": False}


@router.get("/trip-plans/{task_id}")
async def get_trip_plan_status(task_id: str) -> dict[str, Any]:
    status = _get_status(task_id)
    return status
