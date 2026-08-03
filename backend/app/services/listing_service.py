from __future__ import annotations

from app.core.exceptions import NotFoundError
from app.models.listing import Listing
from app.models.taxonomy import Category, CategoryGroup
from app.repositories.listing_repository import ListingRepository


class ListingService:
    def __init__(self, repository: ListingRepository) -> None:
        self._repository = repository

    async def list_listings(
        self,
        *,
        category_id: str | None = None,
        category_group_id: str | None = None,
        status: str | None = None,
        page: int = 1,
        limit: int = 20,
        sort: str = "created_at_desc",
    ) -> tuple[list[Listing], int]:
        if page < 1:
            page = 1
        if limit < 1:
            limit = 20
        return await self._repository.list(
            category_id=category_id,
            category_group_id=category_group_id,
            status=status,
            page=page,
            limit=limit,
            sort=sort,
        )

    async def get_listing_by_slug(self, slug: str) -> Listing:
        listing = await self._repository.get_by_slug(slug)
        if listing is None:
            raise NotFoundError("Listing not found")
        return listing
