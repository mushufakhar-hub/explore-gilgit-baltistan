from __future__ import annotations

import asyncio
import sys
from pathlib import Path
from typing import Any
from uuid import uuid4

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.models import (
    BusinessProfile,
    Category,
    CategoryGroup,
    FleetItem,
    Listing,
    RoomInventory,
    TourSlot,
    User,
)
from app.models.booking import Availability, BookingModelEnum
from app.models.taxonomy import ListingKind


def _uuid() -> str:
    return uuid4().hex


async def get_or_create(
    session: AsyncSession,
    model: type,
    lookup: dict[str, Any],
    defaults: dict[str, Any] | None = None,
) -> Any:
    statement = select(model).filter_by(**lookup)
    result = await session.execute(statement)
    instance = result.scalar_one_or_none()
    if instance:
        if defaults:
            for key, value in defaults.items():
                setattr(instance, key, value)
        return instance

    params = {**lookup, **(defaults or {})}
    instance = model(**params)
    session.add(instance)
    return instance


async def seed_taxonomy(session: AsyncSession) -> dict[str, Category]:
    groups = [
        {
            "id": "group_business",
            "slug": "business",
            "name": "Business Services",
            "description": "Local businesses, guided tours, transportation, and restaurant experiences.",
            "is_active": True,
        },
        {
            "id": "group_poi",
            "slug": "poi",
            "name": "Points of Interest",
            "description": "Scenic attractions, landmarks, and cultural sites across Gilgit-Baltistan.",
            "is_active": True,
        },
    ]

    category_definitions = [
        {
            "id": "category_hotel",
            "group_id": "group_business",
            "slug": "hotel",
            "name": "Hotels & Stays",
            "description": "Guesthouses, hotels, and campsites with room availability booking.",
            "kind": ListingKind.BUSINESS,
            "booking_model": BookingModelEnum.ROOM_AVAILABILITY,
            "is_active": True,
            "sort_order": 10,
        },
        {
            "id": "category_tour",
            "group_id": "group_business",
            "slug": "tour",
            "name": "Tours & Activities",
            "description": "Guided treks, day trips, and adventure slots.",
            "kind": ListingKind.BUSINESS,
            "booking_model": BookingModelEnum.SLOT_BASED,
            "is_active": True,
            "sort_order": 20,
        },
        {
            "id": "category_car_rental",
            "group_id": "group_business",
            "slug": "car-rental",
            "name": "Car Rental & Transport",
            "description": "Vehicle rentals, airport transfers, and logistics support.",
            "kind": ListingKind.BUSINESS,
            "booking_model": BookingModelEnum.FLEET_AVAILABILITY,
            "is_active": True,
            "sort_order": 30,
        },
        {
            "id": "category_mountain_view",
            "group_id": "group_poi",
            "slug": "mountain-view",
            "name": "Mountain Views",
            "description": "Iconic viewpoints, scenic lookout points, and natural landmarks.",
            "kind": ListingKind.POI,
            "booking_model": BookingModelEnum.NONE,
            "is_active": True,
            "sort_order": 10,
        },
    ]

    for group in groups:
        await get_or_create(
            session,
            CategoryGroup,
            {"slug": group["slug"]},
            {
                "id": group["id"],
                "name": group["name"],
                "description": group["description"],
                "is_active": group["is_active"],
            },
        )

    categories: dict[str, Category] = {}
    for category in category_definitions:
        categories[category["slug"]] = await get_or_create(
            session,
            Category,
            {"group_id": category["group_id"], "slug": category["slug"]},
            {
                "id": category["id"],
                "name": category["name"],
                "description": category["description"],
                "kind": category["kind"],
                "booking_model": category["booking_model"],
                "is_active": category["is_active"],
                "sort_order": category["sort_order"],
            },
        )

    return categories


async def seed_users(session: AsyncSession) -> dict[str, User]:
    users = [
        {
            "id": "user_owner",
            "clerk_user_id": "clerk_owner_1",
            "email": "owner@example.com",
            "display_name": "Local Host",
            "first_name": "Local",
            "last_name": "Host",
            "phone": "+92-300-0000001",
            "is_verified": True,
            "role": "owner",
        },
        {
            "id": "user_tourist",
            "clerk_user_id": "clerk_tourist_1",
            "email": "traveler@example.com",
            "display_name": "Travel Seeker",
            "first_name": "Travel",
            "last_name": "Seeker",
            "phone": "+92-300-0000002",
            "is_verified": True,
            "role": "tourist",
        },
    ]

    created_users: dict[str, User] = {}
    for user_data in users:
        created_users[user_data["role"]] = await get_or_create(
            session,
            User,
            {"clerk_user_id": user_data["clerk_user_id"]},
            {
                "id": user_data["id"],
                "email": user_data["email"],
                "display_name": user_data["display_name"],
                "first_name": user_data["first_name"],
                "last_name": user_data["last_name"],
                "phone": user_data["phone"],
                "is_verified": user_data["is_verified"],
                "role": user_data["role"],
            },
        )

    await get_or_create(
        session,
        BusinessProfile,
        {"owner_id": created_users["owner"].id},
        {
            "id": "bp_owner_1",
            "business_name": "Gilgit Guesthouse & Tours",
            "business_type": "Hospitality",
            "description": "A locally run guesthouse offering mountain tours and curated transport.",
            "phone": "+92-300-1010101",
            "email": "contact@gilgitguesthouse.example",
            "website": "https://gilgitguesthouse.example",
            "is_verified": True,
            "is_active": True,
        },
    )

    return created_users


async def seed_listings(
    session: AsyncSession,
    categories: dict[str, Category],
    owner: User,
) -> None:
    listings = [
        {
            "id": "listing_mountain_guesthouse",
            "slug": "mountain-guesthouse-gilgit",
            "name": "Mountain Guesthouse Gilgit",
            "category_id": categories["hotel"].id,
            "owner_id": owner.id,
            "description": "Comfortable stays with mountain views, locally guided hiking tours, and easy access to nearby treks.",
            "summary": "Guesthouse with room availability and local adventure booking.",
            "country": "Pakistan",
            "region": "Gilgit-Baltistan",
            "city": "Gilgit",
            "address_line_1": "Sultanabad Road",
            "phone": "+92-300-1234567",
            "email": "stay@gilgitguesthouse.example",
            "website": "https://gilgitguesthouse.example",
            "status": "published",
            "verification_status": "verified",
            "is_featured": True,
            "is_published": True,
            "seo_title": "Mountain Guesthouse Gilgit | Stay in Gilgit-Baltistan",
            "seo_description": "Book rooms and local tours at Mountain Guesthouse Gilgit with easy online availability and curated experiences.",
            "canonical_url": "https://example.com/listings/mountain-guesthouse-gilgit",
            "attributes": {
                "amenities": ["free_wifi", "breakfast", "tour_support"],
                "rating": 4.9,
            },
        },
        {
            "id": "listing_river_trek",
            "slug": "river-valley-day-trek",
            "name": "River Valley Day Trek",
            "category_id": categories["tour"].id,
            "owner_id": owner.id,
            "description": "A guided day trek through the river valley with picnic stops and local storytelling.",
            "summary": "Slot-based tour for small groups, ideal for first-time visitors.",
            "country": "Pakistan",
            "region": "Gilgit-Baltistan",
            "city": "Hunza",
            "phone": "+92-300-2345678",
            "status": "published",
            "verification_status": "verified",
            "is_featured": False,
            "is_published": True,
            "seo_title": "River Valley Day Trek | Guided Tours",
            "seo_description": "Reserve a guided day trek through Gilgit-Baltistan's river valley with an experienced local guide.",
            "canonical_url": "https://example.com/listings/river-valley-day-trek",
            "attributes": {
                "duration": "1 day",
                "difficulty": "moderate",
            },
        },
    ]

    for listing_data in listings:
        listing = await get_or_create(
            session,
            Listing,
            {"slug": listing_data["slug"]},
            listing_data,
        )

        if listing.category_id == categories["hotel"].id:
            await get_or_create(
                session,
                RoomInventory,
                {"listing_id": listing.id, "room_type": "standard"},
                {
                    "id": "room_inventory_standard",
                    "room_name": "Standard Double Room",
                    "max_guests": 2,
                    "bed_type": "Double",
                    "size_sqft": 280,
                    "rate_per_night": 9500.0,
                    "currency": "PKR",
                    "available_count": 4,
                    "is_active": True,
                },
            )
            await get_or_create(
                session,
                Availability,
                {
                    "listing_id": listing.id,
                    "booking_model": BookingModelEnum.ROOM_AVAILABILITY,
                    "resource_type": "room",
                    "resource_id": "standard",
                },
                {
                    "id": "availability_standard_room",
                    "start_at": None,
                    "end_at": None,
                    "available_quantity": 4,
                    "booked_quantity": 0,
                    "is_active": True,
                },
            )

        if listing.category_id == categories["tour"].id:
            await get_or_create(
                session,
                TourSlot,
                {"listing_id": listing.id, "slot_type": "morning"},
                {
                    "id": "tour_slot_morning",
                    "title": "Morning River Valley Trek",
                    "start_time": None,
                    "end_time": None,
                    "available_seats": 12,
                    "price_per_person": 4200.0,
                    "currency": "PKR",
                    "is_active": True,
                },
            )
            await get_or_create(
                session,
                Availability,
                {
                    "listing_id": listing.id,
                    "booking_model": BookingModelEnum.SLOT_BASED,
                    "resource_type": "tour_slot",
                    "resource_id": "morning",
                },
                {
                    "id": "availability_river_trek_morning",
                    "start_at": None,
                    "end_at": None,
                    "available_quantity": 12,
                    "booked_quantity": 0,
                    "is_active": True,
                },
            )

    print("Seeded sample listings and booking resources.")


async def main() -> None:
    print(f"Using database URL: {settings.database_url}")
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        categories = await seed_taxonomy(session)
        users = await seed_users(session)
        await seed_listings(session, categories, users["owner"])
        await session.commit()

    print("Database seed complete.")


if __name__ == "__main__":
    asyncio.run(main())
