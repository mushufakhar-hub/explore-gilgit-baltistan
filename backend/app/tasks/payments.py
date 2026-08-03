from __future__ import annotations

from celery import shared_task


@shared_task(name="process_post_payment_work")
def process_post_payment_work(booking_id: str, idempotency_key: str, provider: str) -> dict[str, str]:
    return {
        "booking_id": booking_id,
        "idempotency_key": idempotency_key,
        "provider": provider,
        "status": "queued",
    }
