from __future__ import annotations

from enum import Enum as PyEnum

from sqlalchemy import Boolean, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ListingKind(PyEnum):
    BUSINESS = "BUSINESS"
    POI = "POI"


class BookingModelEnum(PyEnum):
    NONE = "NONE"
    TABLE_RESERVATION = "TABLE_RESERVATION"
    ROOM_AVAILABILITY = "ROOM_AVAILABILITY"
    FLEET_AVAILABILITY = "FLEET_AVAILABILITY"
    SLOT_BASED = "SLOT_BASED"


class CategoryGroup(Base):
    __tablename__ = "category_groups"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    categories: Mapped[list[Category]] = relationship(
        back_populates="group",
        cascade="all, delete-orphan",
    )


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    group_id: Mapped[str] = mapped_column(ForeignKey("category_groups.id"), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    kind: Mapped[ListingKind] = mapped_column(
        Enum(ListingKind, name="listing_kind", native_enum=False),
        nullable=False,
        default=ListingKind.BUSINESS,
        index=True,
    )
    booking_model: Mapped[BookingModelEnum] = mapped_column(
        Enum(BookingModelEnum, name="booking_model", native_enum=False),
        nullable=False,
        default=BookingModelEnum.NONE,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(default=0, nullable=False)

    group: Mapped[CategoryGroup] = relationship(back_populates="categories")

    __table_args__ = ({"unique_constraint": ("group_id", "slug")},)
