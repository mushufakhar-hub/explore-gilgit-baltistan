from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.booking import BookingStatus
from app.models.taxonomy import BookingModelEnum


class AvailabilityBase(BaseModel):
    listing_id: str = Field(..., min_length=1, max_length=64)
    booking_model: BookingModelEnum
    resource_type: str = Field(..., min_length=1, max_length=40)
    resource_id: str = Field(..., min_length=1, max_length=64)
    start_at: datetime | None = None
    end_at: datetime | None = None
    available_quantity: int = Field(default=1, ge=0)
    booked_quantity: int = Field(default=0, ge=0)
    is_active: bool = True


class AvailabilityCreate(AvailabilityBase):
    id: str = Field(..., min_length=1, max_length=64)


class AvailabilityUpdate(BaseModel):
    booking_model: BookingModelEnum | None = None
    resource_type: str | None = Field(default=None, min_length=1, max_length=40)
    resource_id: str | None = Field(default=None, min_length=1, max_length=64)
    start_at: datetime | None = None
    end_at: datetime | None = None
    available_quantity: int | None = Field(default=None, ge=0)
    booked_quantity: int | None = Field(default=None, ge=0)
    is_active: bool | None = None


class AvailabilityRead(AvailabilityBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BookingBase(BaseModel):
    listing_id: str = Field(..., min_length=1, max_length=64)
    user_id: str = Field(..., min_length=1, max_length=64)
    availability_id: str | None = Field(default=None, min_length=1, max_length=64)
    booking_model: BookingModelEnum
    resource_type: str = Field(..., min_length=1, max_length=40)
    resource_id: str = Field(..., min_length=1, max_length=64)
    quantity: int = Field(default=1, ge=1)
    status: BookingStatus = BookingStatus.PENDING
    check_in_at: datetime | None = None
    check_out_at: datetime | None = None
    total_amount: float = Field(default=0.0, ge=0)
    currency: str = Field(default="PKR", max_length=8)
    notes: str | None = None


class BookingCreate(BookingBase):
    id: str = Field(..., min_length=1, max_length=64)


class BookingUpdate(BaseModel):
    availability_id: str | None = Field(default=None, min_length=1, max_length=64)
    quantity: int | None = Field(default=None, ge=1)
    status: BookingStatus | None = None
    check_in_at: datetime | None = None
    check_out_at: datetime | None = None
    total_amount: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, max_length=8)
    notes: str | None = None


class BookingRead(BookingBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CancellationBase(BaseModel):
    booking_id: str = Field(..., min_length=1, max_length=64)
    reason: str | None = None
    cancelled_by: str | None = Field(default=None, max_length=64)
    status: str = "requested"


class CancellationCreate(CancellationBase):
    id: str = Field(..., min_length=1, max_length=64)


class CancellationRead(CancellationBase):
    id: str
    requested_at: datetime
    processed_at: datetime | None = None

    model_config = {"from_attributes": True}


class RefundBase(BaseModel):
    booking_id: str = Field(..., min_length=1, max_length=64)
    cancellation_id: str | None = Field(default=None, min_length=1, max_length=64)
    amount: float = Field(default=0.0, ge=0)
    currency: str = Field(default="PKR", max_length=8)
    status: str = "pending"
    reason: str | None = None


class RefundCreate(RefundBase):
    id: str = Field(..., min_length=1, max_length=64)


class RefundRead(RefundBase):
    id: str
    created_at: datetime
    processed_at: datetime | None = None

    model_config = {"from_attributes": True}


class PromoCodeBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=60)
    discount_type: str = Field(default="percentage", max_length=20)
    value: float = Field(default=0.0, ge=0)
    min_order_amount: float | None = Field(default=None, ge=0)
    valid_from: datetime | None = None
    valid_to: datetime | None = None
    is_active: bool = True
    usage_limit: int | None = Field(default=None, ge=1)
    used_count: int = Field(default=0, ge=0)


class PromoCodeCreate(PromoCodeBase):
    id: str = Field(..., min_length=1, max_length=64)


class PromoCodeRead(PromoCodeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class InvoiceBase(BaseModel):
    booking_id: str = Field(..., min_length=1, max_length=64)
    invoice_number: str = Field(..., min_length=1, max_length=80)
    subtotal: float = Field(default=0.0, ge=0)
    discount_amount: float = Field(default=0.0, ge=0)
    tax_amount: float = Field(default=0.0, ge=0)
    total_amount: float = Field(default=0.0, ge=0)
    currency: str = Field(default="PKR", max_length=8)
    status: str = "draft"
    issued_at: datetime | None = None
    paid_at: datetime | None = None


class InvoiceCreate(InvoiceBase):
    id: str = Field(..., min_length=1, max_length=64)


class InvoiceRead(InvoiceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
