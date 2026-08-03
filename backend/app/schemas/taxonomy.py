from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class ListingKind(str, Enum):
    BUSINESS = "BUSINESS"
    POI = "POI"


class BookingModel(str, Enum):
    NONE = "NONE"
    TABLE_RESERVATION = "TABLE_RESERVATION"
    ROOM_AVAILABILITY = "ROOM_AVAILABILITY"
    FLEET_AVAILABILITY = "FLEET_AVAILABILITY"
    SLOT_BASED = "SLOT_BASED"


class CategoryGroupBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=120)
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    is_active: bool = True


class CategoryGroupCreate(CategoryGroupBase):
    id: str = Field(..., min_length=1, max_length=64)


class CategoryGroupRead(CategoryGroupBase):
    id: str

    model_config = {"from_attributes": True}


class CategoryBase(BaseModel):
    group_id: str = Field(..., min_length=1, max_length=64)
    slug: str = Field(..., min_length=1, max_length=120)
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    kind: ListingKind = ListingKind.BUSINESS
    booking_model: BookingModel = BookingModel.NONE
    is_active: bool = True
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    id: str = Field(..., min_length=1, max_length=64)


class CategoryRead(CategoryBase):
    id: str

    model_config = {"from_attributes": True}


class CategoryTreeNode(BaseModel):
    group: CategoryGroupRead
    categories: list[CategoryRead]

    model_config = {"from_attributes": True}
