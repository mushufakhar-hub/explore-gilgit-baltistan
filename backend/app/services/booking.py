from __future__ import annotations

from app.core.exceptions import BadRequestError
from app.models.booking import Booking, BookingStatus
from app.models.taxonomy import BookingModelEnum


class BookingStateMachine:
    """Single explicit transition table for all booking-model variants."""

    VALID_TRANSITIONS: dict[BookingStatus, set[BookingStatus]] = {
        BookingStatus.PENDING: {BookingStatus.CONFIRMED, BookingStatus.CANCELLED},
        BookingStatus.CONFIRMED: {BookingStatus.COMPLETED, BookingStatus.CANCELLED},
        BookingStatus.COMPLETED: set(),
        BookingStatus.CANCELLED: set(),
    }

    @classmethod
    def transition(cls, current: BookingStatus, next_status: BookingStatus) -> BookingStatus:
        allowed = cls.VALID_TRANSITIONS.get(current, set())
        if next_status not in allowed:
            raise BadRequestError(
                "Invalid booking transition",
                {
                    "from": current.value,
                    "to": next_status.value,
                    "allowed": sorted(status.value for status in allowed),
                },
            )
        return next_status


class BookingService:
    """Shared booking engine for room, table, fleet, and slot reservations."""

    @staticmethod
    def _resolve_booking_model_enum(model: str | BookingModelEnum) -> BookingModelEnum:
        if isinstance(model, BookingModelEnum):
            return model
        return BookingModelEnum(model)

    @classmethod
    def apply_transition(
        cls,
        booking: Booking,
        next_status: BookingStatus | str,
    ) -> BookingStatus:
        target_status = next_status if isinstance(next_status, BookingStatus) else BookingStatus(next_status)
        new_status = BookingStateMachine.transition(booking.status, target_status)
        booking.status = new_status
        return new_status

    @classmethod
    def validate_booking_model(cls, model: str | BookingModelEnum) -> BookingModelEnum:
        return cls._resolve_booking_model_enum(model)

    @classmethod
    def validate_transition(
        cls,
        current: BookingStatus | str,
        next_status: BookingStatus | str,
    ) -> BookingStatus:
        current_status = current if isinstance(current, BookingStatus) else BookingStatus(current)
        target_status = next_status if isinstance(next_status, BookingStatus) else BookingStatus(next_status)
        return BookingStateMachine.transition(current_status, target_status)
