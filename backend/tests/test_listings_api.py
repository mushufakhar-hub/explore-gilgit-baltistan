from __future__ import annotations

from datetime import datetime, timezone

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db import session as session_module
from app.models.listing import Listing
from app.models.taxonomy import BookingModelEnum, Category, CategoryGroup, ListingKind


@pytest.fixture
async def client() -> AsyncClient:
    test_engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    test_session_factory = async_sessionmaker(bind=test_engine, expire_on_commit=False, class_=AsyncSession)

    original_engine = session_module.engine
    original_session_factory = session_module.AsyncSessionLocal
    session_module.engine = test_engine
    session_module.AsyncSessionLocal = test_session_factory

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with test_session_factory() as session:
        group = CategoryGroup(
            id="group_hotels",
            slug="stay",
            name="Stay",
            description="Stay category group",
            is_active=True,
        )
        category = Category(
            id="cat_hotels",
            group_id="group_hotels",
            slug="hotels",
            name="Hotels",
            description="Hotels category",
            kind=ListingKind.BUSINESS,
            booking_model=BookingModelEnum.ROOM_AVAILABILITY,
            is_active=True,
            sort_order=1,
        )
        session.add_all([group, category])
        await session.commit()

        listing = Listing(
            id="listing_hotel",
            category_id="cat_hotels",
            owner_id="user_123",
            name="Serena Hotel",
            slug="serena-hotel",
            description="A hotel in Gilgit",
            status="published",
            verification_status="approved",
            is_published=True,
            country="Pakistan",
            region="Gilgit-Baltistan",
            city="Gilgit",
            latitude=35.92,
            longitude=74.31,
            attributes={"stars": 4},
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        session.add(listing)
        await session.commit()

    transport = ASGITransport(app=__import__("app.main", fromlist=["app"]).app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

    session_module.engine = original_engine
    session_module.AsyncSessionLocal = original_session_factory
    await test_engine.dispose()
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.mark.asyncio
async def test_list_listings_endpoint(client: AsyncClient) -> None:
    response = await client.get("/api/v1/listings")
    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] >= 1
    assert len(payload["items"]) >= 1
    assert payload["items"][0]["name"] == "Serena Hotel"


@pytest.mark.asyncio
async def test_get_listing_detail_endpoint(client: AsyncClient) -> None:
    response = await client.get("/api/v1/listings/serena-hotel")
    assert response.status_code == 200
    payload = response.json()
    assert payload["slug"] == "serena-hotel"
    assert payload["city"] == "Gilgit"
