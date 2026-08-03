from __future__ import annotations

import pytest

from app.core.exceptions import BadRequestError
from app.models.booking import Booking, BookingStatus
from app.models.taxonomy import BookingModelEnum
from app.services.booking import BookingService, BookingStateMachine


@pytest.mark.parametrize(
    ("from_status", "to_status"),
    [
        (BookingStatus.PENDING, BookingStatus.CONFIRMED),
        (BookingStatus.PENDING, BookingStatus.CANCELLED),
        (BookingStatus.CONFIRMED, BookingStatus.COMPLETED),
        (BookingStatus.CONFIRMED, BookingStatus.CANCELLED),
    ],
)
def test_valid_booking_transitions(from_status: BookingStatus, to_status: BookingStatus) -> None:
    assert BookingStateMachine.transition(from_status, to_status) == to_status


@pytest.mark.parametrize(
    ("from_status", "to_status"),
    [
        (BookingStatus.PENDING, BookingStatus.PENDING),
        (BookingStatus.PENDING, BookingStatus.COMPLETED),
        (BookingStatus.CONFIRMED, BookingStatus.PENDING),
        (BookingStatus.CONFIRMED, BookingStatus.CONFIRMED),
        (BookingStatus.COMPLETED, BookingStatus.CONFIRMED),
        (BookingStatus.CANCELLED, BookingStatus.CONFIRMED),
    ],
)
def test_invalid_booking_transitions(from_status: BookingStatus, to_status: BookingStatus) -> None:
    with pytest.raises(BadRequestError):
        BookingStateMachine.transition(from_status, to_status)


@pytest.mark.parametrize(
    "model_value",
    [
        BookingModelEnum.ROOM_AVAILABILITY,
        BookingModelEnum.TABLE_RESERVATION,
        BookingModelEnum.FLEET_AVAILABILITY,
        BookingModelEnum.SLOT_BASED,
    ],
)
def test_booking_model_validation_accepts_all_model_types(model_value: BookingModelEnum) -> None:
    assert BookingService.validate_booking_model(model_value) == model_value
    assert BookingService.validate_booking_model(model_value.value) == model_value


def test_booking_service_apply_transition_updates_booking_status() -> None:
    booking = Booking(
        id="b1",
        listing_id="l1",
        user_id="u1",
        booking_model=BookingModelEnum.ROOM_AVAILABILITY,
        resource_type="room",
        resource_id="r1",
        quantity=2,
        status=BookingStatus.PENDING,
        total_amount=1200.0,
        currency="PKR",
    )

    result = BookingService.apply_transition(booking, BookingStatus.CONFIRMED)

    assert result == BookingStatus.CONFIRMED
    assert booking.status == BookingStatus.CONFIRMED


def test_booking_service_rejects_invalid_transition() -> None:
    booking = Booking(
        id="b2",
        listing_id="l2",
        user_id="u2",
        booking_model=BookingModelEnum.SLOT_BASED,
        resource_type="slot",
        resource_id="s1",
        quantity=1,
        status=BookingStatus.CONFIRMED,
        total_amount=500.0,
        currency="PKR",
    )

    with pytest.raises(BadRequestError):
        BookingService.apply_transition(booking, BookingStatus.PENDING)
