from __future__ import annotations

import asyncio
import io
import logging
import tempfile
from typing import Any

import requests
from celery import shared_task

from app.core.config import settings

logger = logging.getLogger(__name__)


def _get_redis_client():
    try:
        import redis

        return redis.from_url(settings.redis_url, decode_responses=True)
    except Exception:
        return None


def _acquire_idempotency(key: str, ttl: int = 60 * 60 * 24) -> bool:
    """Return True if caller acquired the idempotency lock, False if already exists."""
    r = _get_redis_client()
    if r is None:
        return True
    try:
        return r.set(key, "1", nx=True, ex=ttl)
    except Exception:
        return True


def _release_idempotency(key: str) -> None:
    r = _get_redis_client()
    if r is None:
        return
    try:
        r.delete(key)
    except Exception:
        return


@shared_task(bind=True, name="send_notification")
def send_notification(self, user_id: str, message: str, idempotency_key: str | None = None) -> dict[str, Any]:
    key = f"notif:{idempotency_key}" if idempotency_key else None
    if key and not _acquire_idempotency(key):
        return {"status": "duplicate"}

    try:
        # Placeholder: integrate with real notification provider (email/SMS/push)
        logger.info("Sending notification to %s: %s", user_id, message)
        return {"status": "sent", "user_id": user_id}
    except Exception as exc:  # pragma: no cover - retry path
        if key:
            _release_idempotency(key)
        raise self.retry(exc=exc, countdown=min(2 ** self.request.retries, 60), max_retries=5)


@shared_task(bind=True, name="process_uploaded_image")
def process_uploaded_image(
    self,
    image_url: str,
    target_path: str | None = None,
    idempotency_key: str | None = None,
    max_width: int = 2048,
) -> dict[str, Any]:
    key = f"img:{idempotency_key}" if idempotency_key else None
    if key and not _acquire_idempotency(key):
        return {"status": "duplicate"}

    try:
        resp = requests.get(image_url, timeout=20)
        resp.raise_for_status()
        img_bytes = io.BytesIO(resp.content)

        try:
            from PIL import Image

            img = Image.open(img_bytes)
            # Resize preserving aspect ratio
            if max_width and img.width > max_width:
                ratio = max_width / float(img.width)
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.LANCZOS)

            # Save as WebP into a temp file
            with tempfile.NamedTemporaryFile(suffix=".webp", delete=False) as out_f:
                img.save(out_f, format="WEBP", quality=80)
                out_path = out_f.name

            # If Cloudinary configured, attempt upload (best-effort)
            if getattr(settings, "cloudinary_url", None):
                try:
                    import cloudinary.uploader as uploader

                    uploader.upload(out_path, resource_type="image", overwrite=True)
                except Exception:
                    logger.exception("Cloudinary upload failed, falling back to local path")

            result = {"status": "processed", "path": out_path}
            return result
        except Exception:
            logger.exception("Image processing failed")
            raise
    except Exception as exc:  # pragma: no cover - retry path
        if key:
            _release_idempotency(key)
        raise self.retry(exc=exc, countdown=min(2 ** self.request.retries, 60), max_retries=5)


@shared_task(bind=True, name="generate_invoice")
def generate_invoice(self, booking_id: str, idempotency_key: str | None = None) -> dict[str, Any]:
    key = f"inv:{idempotency_key or booking_id}"
    if key and not _acquire_idempotency(key):
        return {"status": "duplicate"}

    try:
        async def _do():
            from app.db.session import AsyncSessionLocal
            from app.models.booking import Booking
            from app.models.booking import Invoice
            from sqlalchemy import select

            async with AsyncSessionLocal() as session:
                booking = await session.get(Booking, booking_id)
                if booking is None:
                    return {"status": "not_found"}

                # If invoice already exists, return it
                if booking.invoice is not None:
                    return {"status": "exists", "invoice_id": booking.invoice.id}

                invoice_id = f"inv_{booking_id}_{int(asyncio.get_event_loop().time())}"
                invoice = Invoice(
                    id=invoice_id,
                    booking_id=booking_id,
                    invoice_number=invoice_id,
                    subtotal=booking.total_amount,
                    discount_amount=0.0,
                    tax_amount=0.0,
                    total_amount=booking.total_amount,
                    currency=booking.currency,
                    status="issued",
                )
                session.add(invoice)
                await session.commit()
                return {"status": "created", "invoice_id": invoice_id}

        result = asyncio.run(_do())
        return result
    except Exception as exc:  # pragma: no cover - retry path
        _release_idempotency(key)
        raise self.retry(exc=exc, countdown=min(2 ** self.request.retries, 60), max_retries=5)


@shared_task(bind=True, name="poi_data_sync")
def poi_data_sync(self) -> dict[str, Any]:
    """Scheduled job: sync Points-Of-Interest for Essential Services categories hourly."""
    try:
        async def _sync():
            from app.db.session import AsyncSessionLocal

            # Placeholder: call external data sources and reconcile changes
            updated = 0
            async with AsyncSessionLocal() as session:
                # Real implementation would query external API and upsert
                logger.info("POI sync tick: would fetch external data and upsert into DB")
                # simulated change
                updated = 0
            return updated

        updated_count = asyncio.run(_sync())
        return {"status": "ok", "updated": updated_count}
    except Exception as exc:  # pragma: no cover - retry path
        raise self.retry(exc=exc, countdown=min(2 ** self.request.retries, 60), max_retries=5)
