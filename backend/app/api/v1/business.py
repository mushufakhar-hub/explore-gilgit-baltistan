from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.exceptions import BadRequestError, NotFoundError
from app.db.session import get_db
from app.models.listing import Listing

router = APIRouter(prefix="/business", tags=["business"])


class CreateBusinessListingIn(BaseModel):
    id: str = Field(..., min_length=1, max_length=64)
    name: str = Field(..., min_length=1, max_length=240)
    slug: str = Field(..., min_length=1, max_length=240)
    category_id: str = Field(..., min_length=1, max_length=64)
    summary: str | None = None
    description: str | None = None
    country: str | None = Field(default=None, max_length=120)
    region: str | None = Field(default=None, max_length=120)
    city: str | None = Field(default=None, max_length=120)
    address_line_1: str | None = Field(default=None, max_length=255)
    address_line_2: str | None = Field(default=None, max_length=255)
    postal_code: str | None = Field(default=None, max_length=40)
    phone: str | None = Field(default=None, max_length=40)
    email: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=255)
    attributes: dict | None = None
    status: str = "draft"
    verification_status: str = "unverified"


class UpdateBusinessListingIn(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=240)
    slug: str | None = Field(default=None, min_length=1, max_length=240)
    category_id: str | None = Field(default=None, min_length=1, max_length=64)
    summary: str | None = None
    description: str | None = None
    country: str | None = Field(default=None, max_length=120)
    region: str | None = Field(default=None, max_length=120)
    city: str | None = Field(default=None, max_length=120)
    address_line_1: str | None = Field(default=None, max_length=255)
    address_line_2: str | None = Field(default=None, max_length=255)
    postal_code: str | None = Field(default=None, max_length=40)
    phone: str | None = Field(default=None, max_length=40)
    email: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=255)
    attributes: dict | None = None
    status: str | None = None
    verification_status: str | None = None


@router.post("/listing", status_code=status.HTTP_201_CREATED)
async def create_business_listing(
    payload: CreateBusinessListingIn,
    db: AsyncSession = Depends(get_db),
    user: dict[str, Any] = Depends(get_current_user),
):
    listing = Listing(
        id=payload.id,
        owner_id=user["sub"],
        category_id=payload.category_id,
        name=payload.name,
        slug=payload.slug,
        summary=payload.summary,
        description=payload.description,
        country=payload.country,
        region=payload.region,
        city=payload.city,
        address_line_1=payload.address_line_1,
        address_line_2=payload.address_line_2,
        postal_code=payload.postal_code,
        phone=payload.phone,
        email=payload.email,
        website=payload.website,
        attributes=payload.attributes,
        status=payload.status,
        verification_status=payload.verification_status,
    )
    db.add(listing)
    try:
        await db.commit()
        await db.refresh(listing)
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))

    return {"status": "created", "listing_id": listing.id}


@router.get("/listing/{listing_id}")
async def get_business_listing(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
    user: dict[str, Any] = Depends(get_current_user),
):
    listing = await db.get(Listing, listing_id)
    if listing is None or listing.owner_id != user["sub"]:
        raise NotFoundError("Business listing not found")
    return ListingRead.model_validate(listing).model_dump(mode="json")


@router.put("/listing/{listing_id}")
async def update_business_listing(
    listing_id: str,
    payload: UpdateBusinessListingIn,
    db: AsyncSession = Depends(get_db),
    user: dict[str, Any] = Depends(get_current_user),
):
    listing = await db.get(Listing, listing_id)
    if listing is None or listing.owner_id != user["sub"]:
        raise NotFoundError("Business listing not found")

    update_fields = payload.model_dump(exclude_none=True)
    if "attributes" in update_fields:
        update_fields["attributes"] = {
            **(listing.attributes or {}),
            **(update_fields["attributes"] or {}),
        }

    for key, value in update_fields.items():
        setattr(listing, key, value)

    db.add(listing)
    await db.commit()
    await db.refresh(listing)
    return ListingRead.model_validate(listing).model_dump(mode="json")


@router.post("/listing/{listing_id}/submit-verification")
async def submit_business_listing_verification(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
    user: dict[str, Any] = Depends(get_current_user),
):
    listing = await db.get(Listing, listing_id)
    if listing is None or listing.owner_id != user["sub"]:
        raise NotFoundError("Business listing not found")
    if listing.status != "draft":
        raise BadRequestError("Only draft listings can be submitted for verification")

    listing.status = "pending_review"
    listing.verification_status = "pending"
    db.add(listing)
    await db.commit()
    await db.refresh(listing)
    return {"status": "submitted", "listing_id": listing.id}


class ListingRead(BaseModel):
    id: str
    category_id: str
    owner_id: str | None
    name: str
    slug: str
    summary: str | None = None
    description: str | None = None
    country: str | None = None
    region: str | None = None
    city: str | None = None
    address_line_1: str | None = None
    address_line_2: str | None = None
    postal_code: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    phone: str | None = None
    email: str | None = None
    website: str | None = None
    status: str
    verification_status: str
    attributes: dict | None = None
    is_published: bool
    is_featured: bool
    seo_title: str | None = None
    seo_description: str | None = None
    canonical_url: str | None = None
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
