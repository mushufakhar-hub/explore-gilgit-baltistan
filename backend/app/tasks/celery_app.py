from __future__ import annotations

from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "explore_gb",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.jobs", "app.tasks.payments", "app.tasks.worker", "app.tasks.ai_planner"],
)

celery_app.conf.task_routes = {
    "app.tasks.*": {"queue": "default"},
}
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Celery Beat schedule: hourly POI data sync for Essential Services
celery_app.conf.beat_schedule = {
    "poi_data_sync_hourly": {
        "task": "app.tasks.worker.poi_data_sync",
        "schedule": 3600.0,
        "options": {"queue": "scheduled"},
    }
}
