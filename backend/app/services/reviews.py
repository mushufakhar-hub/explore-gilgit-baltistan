from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestError, ForbiddenError, NotFoundError
from app.models.listing import Listing
from app.models.review import Review, ReviewLike, ReviewPhoto, ReviewReport


class ReviewService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_review(self, user_id: str, listing_id: str, rating: int, text: str | None = None, photos: list[str] | None = None) -> Review:
        rv = Review(
            id=f"rv_{uuid.uuid4().hex[:12]}",
            listing_id=listing_id,
            user_id=user_id,
            rating=rating,
            text=text,
        )
        self.db.add(rv)
        if photos:
            for url in photos:
                photo = ReviewPhoto(id=f"rph_{uuid.uuid4().hex[:12]}", review=rv, url=url)
                self.db.add(photo)
        try:
            await self.db.commit()
            await self.db.refresh(rv)
            return rv
        except IntegrityError as exc:
            await self.db.rollback()
            raise BadRequestError("User has already reviewed this listing") from exc

    async def list_reviews_for_listing(self, listing_id: str) -> list[Review]:
        q = select(Review).where(Review.listing_id == listing_id).order_by(Review.created_at.desc())
        res = await self.db.execute(q)
        return res.scalars().all()

    async def like_review(self, user_id: str, review_id: str) -> dict[str, str]:
        like = ReviewLike(id=f"rl_{uuid.uuid4().hex[:12]}", review_id=review_id, user_id=user_id)
        self.db.add(like)
        try:
            await self.db.commit()
            return {"status": "liked"}
        except IntegrityError:
            await self.db.rollback()
            return {"status": "duplicate"}

    async def report_review(self, user_id: str, review_id: str, reason: str | None = None) -> dict[str, str]:
        report = ReviewReport(id=f"rpt_{uuid.uuid4().hex[:12]}", review_id=review_id, reporter_id=user_id, reason=reason)
        self.db.add(report)
        await self.db.commit()
        return {"status": "reported"}

    async def owner_reply(self, owner_id: str, review_id: str, reply_text: str) -> Review:
        review = await self.db.get(Review, review_id)
        if review is None:
            raise NotFoundError("Review not found")
        # Load listing with its category in one query to avoid lazy async loads
        from sqlalchemy import select
        from sqlalchemy.orm import joinedload

        q = select(Listing).options(joinedload(Listing.category)).where(Listing.id == review.listing_id)
        res = await self.db.execute(q)
        listing = res.scalars().first()
        if listing is None:
            raise NotFoundError("Listing not found")

        # Only listing owner can reply and only BUSINESS-kind listings allow owner replies
        if listing.owner_id != owner_id:
            raise ForbiddenError("Only listing owner can reply")

        from app.models.taxonomy import ListingKind

        # check category kind
        if listing.category.kind != ListingKind.BUSINESS:
            raise BadRequestError("Owner replies allowed for BUSINESS listings only")

        review.owner_reply = reply_text
        review.owner_replied_at = datetime.now(timezone.utc)
        self.db.add(review)
        await self.db.commit()
        await self.db.refresh(review)
        return review
