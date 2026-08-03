from __future__ import annotations

from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.listing import Listing
from app.models.taxonomy import Category


class ListingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list(
        self,
        *,
        category_id: str | None = None,
        category_group_id: str | None = None,
        status: str | None = None,
        page: int = 1,
        limit: int = 20,
        sort: str = "created_at_desc",
    ) -> tuple[list[Listing], int]:
        stmt = (
            select(Listing)
            .join(Category, Listing.category_id == Category.id)
            .options(selectinload(Listing.category))
        )

        if category_id:
            stmt = stmt.where(Listing.category_id == category_id)

        if category_group_id:
            stmt = stmt.where(Category.group_id == category_group_id)

        if status:
            stmt = stmt.where(Listing.status == status)

        count_stmt = select(__import__("sqlalchemy").func.count()).select_from(stmt.order_by(None).subquery())
        total = await self._session.scalar(count_stmt) or 0

        sort_map = {
            "created_at_desc": Listing.created_at.desc(),
            "created_at_asc": Listing.created_at.asc(),
            "name_asc": Listing.name.asc(),
            "name_desc": Listing.name.desc(),
        }
        stmt = stmt.order_by(sort_map.get(sort, Listing.created_at.desc()))
        stmt = stmt.offset((page - 1) * limit).limit(limit)

        result = await self._session.execute(stmt)
        listings = list(result.scalars().all())
        return listings, int(total)

    async def get_by_slug(self, slug: str) -> Listing | None:
        stmt = (
            select(Listing)
            .where(Listing.slug == slug)
            .options(selectinload(Listing.category))
            .limit(1)
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()
