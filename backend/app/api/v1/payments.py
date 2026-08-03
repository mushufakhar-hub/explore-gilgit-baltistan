from __future__ import annotations

import hashlib
import hmac
import json
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import BadRequestError
from app.db.session import get_db
from app.models.booking import Booking, BookingStatus
from app.models.payment import PaymentEvent
from app.services.booking import BookingService
from app.tasks.payments import process_post_payment_work
from app.deps.rate_limit import rate_limiter

router = APIRouter(prefix="/payments", tags=["payments"])


def _compute_signature(payload: bytes, secret: str) -> str:
    return hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()


def _status_precedence(status: str) -> int:
    precedence = {
        "pending": 0,
        "failed": 1,
        "succeeded": 2,
        # booking status synonyms -> align booking state to payment precedence
        "confirmed": 2,
        "cancelled": 1,
        "completed": 3,
    }
    return precedence.get(status.lower(), -1)


@router.post("/jazzcash/webhook")
async def jazzcash_webhook(
    request: Request,
    x_signature: str | None = Header(default=None, alias="x-signature"),
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _rl=Depends(rate_limiter(60, 60)),
) -> dict[str, Any]:
    payload = await request.body()
    if not x_signature:
        raise HTTPException(status_code=400, detail="missing signature")

    expected = _compute_signature(payload, settings.payment_webhook_secret)
    if not hmac.compare_digest(x_signature, expected):
        raise HTTPException(status_code=401, detail="invalid signature")

    data = json.loads(payload.decode("utf-8"))
    booking_id = str(data.get("booking_id") or data.get("order_id") or data.get("merchant_order_id") or "")
    idempotency_key = str(data.get("idempotency_key") or data.get("transaction_id") or data.get("tracking_id") or "")
    provider = "jazzcash"
    status = str(data.get("status") or "pending").lower()

    if not booking_id or not idempotency_key:
        raise HTTPException(status_code=400, detail="missing booking or idempotency payload")

    existing = await db.scalar(
        select(PaymentEvent).where(PaymentEvent.idempotency_key == idempotency_key)
    )
    if existing is not None:
        return {"status": "duplicate", "idempotency_key": idempotency_key, "event_id": existing.id}

    event = PaymentEvent(
        id=f"payevt_{booking_id}_{idempotency_key}",
        booking_id=booking_id,
        provider=provider,
        status=status,
        idempotency_key=idempotency_key,
        raw_payload=json.dumps(data, sort_keys=True),
        signature=x_signature,
        is_processed=False,
    )
    db.add(event)
    await db.flush()

    booking = await db.get(Booking, booking_id)
    if booking is None:
        raise HTTPException(status_code=404, detail="booking not found")

    current_status = booking.status
    current_precedence = _status_precedence(current_status.value if hasattr(current_status, "value") else str(current_status))
    new_precedence = _status_precedence(status)
    if current_precedence >= new_precedence:
        event.is_processed = True
        await db.commit()
        return {"status": "ignored", "booking_id": booking_id, "event_status": status}

    try:
        BookingService.apply_transition(booking, BookingStatus.CONFIRMED if status == "succeeded" else BookingStatus.CANCELLED)
        event.status = status
        event.is_processed = True
        await db.commit()
    except BadRequestError:
        event.is_processed = True
        await db.rollback()
        raise HTTPException(status_code=409, detail="booking transition rejected")

    process_post_payment_work.delay(str(booking_id), str(idempotency_key), provider)
    return {"status": "processed", "booking_id": booking_id, "event_status": status}


@router.post("/easypaisa/webhook")
async def easypaisa_webhook(
    request: Request,
    x_signature: str | None = Header(default=None, alias="x-signature"),
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _rl=Depends(rate_limiter(60, 60)),
) -> dict[str, Any]:
    return await jazzcash_webhook(request=request, x_signature=x_signature, db=db)
