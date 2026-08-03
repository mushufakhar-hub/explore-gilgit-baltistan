from __future__ import annotations

import json
import jwt
import asyncio

from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.main import app
from app.db.session import get_db
from app.models.listing import Listing
from app.models.taxonomy import Category, CategoryGroup, ListingKind
from app.models.review import Review


def _token_for(payload: dict) -> str:
    return jwt.encode(payload, "secret", algorithm="HS256")


def setup_test_db():
    engine = create_async_engine("sqlite+aiosqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool, future=True)
    Session = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

    async def _create():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        async with Session() as s:
            # create a category group and categories
            cg = CategoryGroup(id="cg_1", slug="services", name="Services")
            cat_business = Category(id="cat_b", group=cg, slug="biz", name="Business", kind=ListingKind.BUSINESS)
            cat_poi = Category(id="cat_p", group=cg, slug="poi", name="POI", kind=ListingKind.POI)
            s.add_all([cg, cat_business, cat_poi])
            await s.commit()

            # create listings
            l1 = Listing(id="l_biz", category=cat_business, owner_id="owner_1", name="Biz1", slug="biz1")
            l2 = Listing(id="l_poi", category=cat_poi, owner_id="owner_2", name="Poi1", slug="poi1")
            s.add_all([l1, l2])
            await s.commit()

    asyncio.run(_create())

    async def _override_get_db():
        async with Session() as session:
            yield session

    return _override_get_db


def test_review_flow():
    override = setup_test_db()
    app.dependency_overrides[get_db] = override

    client = TestClient(app)
    token_user = _token_for({"sub": "user_1"})
    token_owner = _token_for({"sub": "owner_1"})

    # create review as user_1 on biz listing
    resp = client.post("/api/v1/reviews/listings/l_biz", headers={"Authorization": f"Bearer {token_user}"}, json={"rating": 5, "text":"Great!"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "created"
    rv_id = data["review_id"]

    # duplicate review by same user should fail
    resp2 = client.post("/api/v1/reviews/listings/l_biz", headers={"Authorization": f"Bearer {token_user}"}, json={"rating": 4})
    assert resp2.status_code == 400

    # like the review
    resp3 = client.post(f"/api/v1/reviews/{rv_id}/like", headers={"Authorization": f"Bearer {token_user}"})
    assert resp3.status_code == 200
    assert resp3.json()["status"] in ("liked", "duplicate")

    # owner replies (allowed for business)
    resp4 = client.post(f"/api/v1/reviews/{rv_id}/owner-reply", headers={"Authorization": f"Bearer {token_owner}"}, json={"reply":"Thanks!"})
    assert resp4.status_code == 200
    assert resp4.json()["status"] == "replied"

    # reporting by another user
    token_reporter = _token_for({"sub": "user_2"})
    resp5 = client.post(f"/api/v1/reviews/{rv_id}/report", headers={"Authorization": f"Bearer {token_reporter}"}, json={"reason":"spam"})
    assert resp5.status_code == 200
    assert resp5.json()["status"] == "reported"

    # report incorrect info for POI listing (lighter flow): create review and report
    resp6 = client.post("/api/v1/reviews/listings/l_poi", headers={"Authorization": f"Bearer {token_user}"}, json={"rating": 3, "text":"OK"})
    assert resp6.status_code == 200
    rv_id2 = resp6.json()["review_id"]
    resp7 = client.post(f"/api/v1/reviews/{rv_id2}/report", headers={"Authorization": f"Bearer {token_user}"}, json={"reason":"wrong address"})
    assert resp7.status_code == 200

    app.dependency_overrides.clear()
