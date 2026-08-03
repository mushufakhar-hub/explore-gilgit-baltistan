from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.auth import get_current_user
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.reviews import ReviewService
from app.deps.rate_limit import rate_limiter

router = APIRouter(prefix="/reviews", tags=["reviews"])


class CreateReviewIn(BaseModel):
    rating: int
    text: str | None = None
    photos: list[str] | None = None


@router.post("/listings/{listing_id}")
async def create_review(listing_id: str, payload: CreateReviewIn, db: AsyncSession = Depends(get_db), user: dict[str, Any] = Depends(get_current_user), _rl=Depends(rate_limiter(10, 60))):
    svc = ReviewService(db)
    try:
        rv = await svc.create_review(user_id=user["sub"], listing_id=listing_id, rating=payload.rating, text=payload.text, photos=payload.photos)
        return {"status": "created", "review_id": rv.id}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/listings/{listing_id}")
async def list_reviews(listing_id: str, db: AsyncSession = Depends(get_db)):
    svc = ReviewService(db)
    rows = await svc.list_reviews_for_listing(listing_id)
    return [{"id": r.id, "user_id": r.user_id, "rating": r.rating, "text": r.text, "owner_reply": r.owner_reply} for r in rows]


@router.post("/{review_id}/like")
async def like_review(review_id: str, db: AsyncSession = Depends(get_db), user: dict[str, Any] = Depends(get_current_user), _rl=Depends(rate_limiter(20, 60))):
    svc = ReviewService(db)
    res = await svc.like_review(user_id=user["sub"], review_id=review_id)
    return res


class ReportIn(BaseModel):
    reason: str | None = None


@router.post("/{review_id}/report")
async def report_review(review_id: str, payload: ReportIn, db: AsyncSession = Depends(get_db), user: dict[str, Any] = Depends(get_current_user), _rl=Depends(rate_limiter(20, 60))):
    svc = ReviewService(db)
    res = await svc.report_review(user_id=user["sub"], review_id=review_id, reason=payload.reason)
    return res


class OwnerReplyIn(BaseModel):
    reply: str


@router.post("/{review_id}/owner-reply")
async def owner_reply(review_id: str, payload: OwnerReplyIn, db: AsyncSession = Depends(get_db), user: dict[str, Any] = Depends(get_current_user), _rl=Depends(rate_limiter(5, 60))):
    svc = ReviewService(db)
    try:
        rv = await svc.owner_reply(owner_id=user["sub"], review_id=review_id, reply_text=payload.reply)
        return {"status": "replied", "review_id": rv.id}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
