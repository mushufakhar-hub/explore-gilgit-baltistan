from __future__ import annotations

import hashlib
import hmac
import json

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.api.v1 import payments as payments_module
from app.db.base import Base
from app.db.session import get_db
from app.models.booking import Booking, BookingStatus
from app.models.taxonomy import BookingModelEnum


@pytest.fixture
def client() -> TestClient:
    from app.main import app

    test_engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    test_session_factory = async_sessionmaker(bind=test_engine, expire_on_commit=False, class_=AsyncSession)

    async def seed_db() -> None:
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with test_session_factory() as session:
            booking = Booking(
                id="b-001",
                listing_id="l-001",
                user_id="u-001",
                booking_model=BookingModelEnum.ROOM_AVAILABILITY,
                resource_type="room",
                resource_id="r-001",
                quantity=1,
                status=BookingStatus.PENDING,
                total_amount=3000.0,
                currency="PKR",
            )
            session.add(booking)
            await session.commit()

    import asyncio
    asyncio.run(seed_db())

    async def override_get_db():
        async with test_session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[payments_module.get_db] = override_get_db

    class FakeTask:
        def __init__(self) -> None:
            self.calls: list[tuple[tuple[object, ...], dict[str, object]]] = []

        def delay(self, *args: object, **kwargs: object) -> None:
            self.calls.append((args, kwargs))

    fake_task = FakeTask()

    monkeypatch = pytest.MonkeyPatch()
    monkeypatch.setattr(payments_module, "process_post_payment_work", fake_task)

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        monkeypatch.undo()
        app.dependency_overrides.clear()
        import asyncio
        asyncio.run(test_engine.dispose())


def _webhook_payload(booking_id: str, idempotency_key: str, status: str) -> dict[str, str]:
    return {
        "booking_id": booking_id,
        "idempotency_key": idempotency_key,
        "status": status,
        "transaction_id": idempotency_key,
    }


def test_duplicate_webhook_delivery_is_idempotent(client: TestClient) -> None:
    booking_id = "b-001"
    idempotency_key = "dup-123"
    payload = _webhook_payload(booking_id, idempotency_key, "succeeded")
    secret = "change-me-in-production"
    body = json.dumps(payload).encode("utf-8")
    signature = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()

    response = client.post(
        "/api/v1/payments/jazzcash/webhook",
        content=body,
        headers={"x-signature": signature},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "processed"

    duplicate = client.post(
        "/api/v1/payments/jazzcash/webhook",
        content=body,
        headers={"x-signature": signature},
    )
    assert duplicate.status_code == 200
    assert duplicate.json()["status"] == "duplicate"


def test_out_of_order_webhook_delivery_is_ignored(client: TestClient) -> None:
    booking_id = "b-001"
    success_payload = _webhook_payload(booking_id, "success-late-456", "succeeded")
    secret = "change-me-in-production"
    success_body = json.dumps(success_payload).encode("utf-8")
    success_signature = hmac.new(secret.encode("utf-8"), success_body, hashlib.sha256).hexdigest()

    success_response = client.post(
        "/api/v1/payments/jazzcash/webhook",
        content=success_body,
        headers={"x-signature": success_signature},
    )
    assert success_response.status_code == 200
    assert success_response.json()["status"] == "processed"

    failed_payload = _webhook_payload(booking_id, "late-123", "failed")
    failed_body = json.dumps(failed_payload).encode("utf-8")
    failed_signature = hmac.new(secret.encode("utf-8"), failed_body, hashlib.sha256).hexdigest()

    failed_response = client.post(
        "/api/v1/payments/jazzcash/webhook",
        content=failed_body,
        headers={"x-signature": failed_signature},
    )
    assert failed_response.status_code == 200
    assert failed_response.json()["status"] == "ignored"
