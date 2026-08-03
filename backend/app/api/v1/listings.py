from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.listing_repository import ListingRepository
from app.schemas.listing import ListingRead
from app.services.listing_service import ListingService

router = APIRouter(prefix="/listings", tags=["listings"])


async def get_listing_service(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ListingService:
    return ListingService(ListingRepository(db))


@router.get("", response_model=dict[str, object], status_code=status.HTTP_200_OK)
async def list_listings(
    category_id: str | None = Query(default=None),
    category_group_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    sort: str = Query(default="created_at_desc"),
    listing_service: ListingService = Depends(get_listing_service),
) -> dict[str, object]:
    listings, total = await listing_service.list_listings(
        category_id=category_id,
        category_group_id=category_group_id,
        status=status,
        page=page,
        limit=limit,
        sort=sort,
    )

    return {
        "items": [ListingRead.model_validate(item).model_dump(mode="json") for item in listings],
        "page": page,
        "limit": limit,
        "total": total,
    }


@router.get("/{slug}", response_model=ListingRead, status_code=status.HTTP_200_OK)
async def get_listing_by_slug(
    slug: str,
    listing_service: ListingService = Depends(get_listing_service),
) -> ListingRead:
    listing = await listing_service.get_listing_by_slug(slug)
    return ListingRead.model_validate(listing)
