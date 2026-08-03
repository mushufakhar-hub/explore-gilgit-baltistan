from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class RoomInventoryBase(BaseModel):
    listing_id: str = Field(..., min_length=1, max_length=64)
    room_type: str = Field(..., min_length=1, max_length=80)
    room_name: str | None = Field(default=None, max_length=120)
    max_guests: int | None = Field(default=None, ge=1)
    bed_type: str | None = Field(default=None, max_length=80)
    size_sqft: int | None = Field(default=None, ge=1)
    rate_per_night: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default="PKR", max_length=8)
    available_count: int = Field(default=1, ge=0)
    is_active: bool = True


class RoomInventoryCreate(RoomInventoryBase):
    id: str = Field(..., min_length=1, max_length=64)


class RoomInventoryUpdate(BaseModel):
    room_type: str | None = Field(default=None, min_length=1, max_length=80)
    room_name: str | None = Field(default=None, max_length=120)
    max_guests: int | None = Field(default=None, ge=1)
    bed_type: str | None = Field(default=None, max_length=80)
    size_sqft: int | None = Field(default=None, ge=1)
    rate_per_night: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, max_length=8)
    available_count: int | None = Field(default=None, ge=0)
    is_active: bool | None = None


class RoomInventoryRead(RoomInventoryBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class FleetItemBase(BaseModel):
    listing_id: str = Field(..., min_length=1, max_length=64)
    vehicle_type: str = Field(..., min_length=1, max_length=80)
    make: str | None = Field(default=None, max_length=80)
    model: str | None = Field(default=None, max_length=120)
    year: int | None = Field(default=None, ge=1900, le=2100)
    seats: int | None = Field(default=None, ge=1)
    transmission: str | None = Field(default=None, max_length=40)
    fuel_type: str | None = Field(default=None, max_length=40)
    daily_rate: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default="PKR", max_length=8)
    is_available: bool = True


class FleetItemCreate(FleetItemBase):
    id: str = Field(..., min_length=1, max_length=64)


class FleetItemUpdate(BaseModel):
    vehicle_type: str | None = Field(default=None, min_length=1, max_length=80)
    make: str | None = Field(default=None, max_length=80)
    model: str | None = Field(default=None, max_length=120)
    year: int | None = Field(default=None, ge=1900, le=2100)
    seats: int | None = Field(default=None, ge=1)
    transmission: str | None = Field(default=None, max_length=40)
    fuel_type: str | None = Field(default=None, max_length=40)
    daily_rate: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, max_length=8)
    is_available: bool | None = None


class FleetItemRead(FleetItemBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TourSlotBase(BaseModel):
    listing_id: str = Field(..., min_length=1, max_length=64)
    slot_type: str = Field(..., min_length=1, max_length=80)
    title: str | None = Field(default=None, max_length=160)
    start_time: datetime | None = None
    end_time: datetime | None = None
    available_seats: int | None = Field(default=None, ge=0)
    price_per_person: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default="PKR", max_length=8)
    is_active: bool = True


class TourSlotCreate(TourSlotBase):
    id: str = Field(..., min_length=1, max_length=64)


class TourSlotUpdate(BaseModel):
    slot_type: str | None = Field(default=None, min_length=1, max_length=80)
    title: str | None = Field(default=None, max_length=160)
    start_time: datetime | None = None
    end_time: datetime | None = None
    available_seats: int | None = Field(default=None, ge=0)
    price_per_person: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, max_length=8)
    is_active: bool | None = None


class TourSlotRead(TourSlotBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
