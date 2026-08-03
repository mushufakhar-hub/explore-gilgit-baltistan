from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ListingBase(BaseModel):
    category_id: str = Field(..., min_length=1, max_length=64)
    owner_id: str | None = None
    name: str = Field(..., min_length=1, max_length=240)
    slug: str = Field(..., min_length=1, max_length=240)
    description: str | None = None
    summary: str | None = None
    country: str | None = Field(default=None, max_length=120)
    region: str | None = Field(default=None, max_length=120)
    city: str | None = Field(default=None, max_length=120)
    address_line_1: str | None = Field(default=None, max_length=255)
    address_line_2: str | None = Field(default=None, max_length=255)
    postal_code: str | None = Field(default=None, max_length=40)
    latitude: float | None = None
    longitude: float | None = None
    phone: str | None = Field(default=None, max_length=40)
    email: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=255)
    status: str = "draft"
    verification_status: str = "unverified"
    is_featured: bool = False
    is_published: bool = False
    seo_title: str | None = Field(default=None, max_length=255)
    seo_description: str | None = None
    canonical_url: str | None = Field(default=None, max_length=255)
    attributes: dict | None = None


class ListingCreate(ListingBase):
    id: str = Field(..., min_length=1, max_length=64)


class ListingUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=240)
    slug: str | None = Field(default=None, min_length=1, max_length=240)
    description: str | None = None
    summary: str | None = None
    category_id: str | None = Field(default=None, min_length=1, max_length=64)
    owner_id: str | None = None
    country: str | None = Field(default=None, max_length=120)
    region: str | None = Field(default=None, max_length=120)
    city: str | None = Field(default=None, max_length=120)
    address_line_1: str | None = Field(default=None, max_length=255)
    address_line_2: str | None = Field(default=None, max_length=255)
    postal_code: str | None = Field(default=None, max_length=40)
    latitude: float | None = None
    longitude: float | None = None
    phone: str | None = Field(default=None, max_length=40)
    email: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=255)
    status: str | None = None
    verification_status: str | None = None
    is_featured: bool | None = None
    is_published: bool | None = None
    seo_title: str | None = Field(default=None, max_length=255)
    seo_description: str | None = None
    canonical_url: str | None = Field(default=None, max_length=255)
    attributes: dict | None = None


class ListingRead(ListingBase):
    id: str
    created_at: datetime
    updated_at: datetime
    published_at: datetime | None = None

    model_config = {"from_attributes": True}
