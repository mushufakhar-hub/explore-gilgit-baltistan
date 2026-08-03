from __future__ import annotations

from celery import shared_task


@shared_task(name="healthcheck")
def healthcheck_task() -> str:
    return "ok"
