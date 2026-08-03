"""Pydantic schemas package."""

from app.schemas.extensions import (
    FleetItemCreate,
    FleetItemRead,
    FleetItemUpdate,
    RoomInventoryCreate,
    RoomInventoryRead,
    RoomInventoryUpdate,
    TourSlotCreate,
    TourSlotRead,
    TourSlotUpdate,
)

__all__ = [
    "FleetItemCreate",
    "FleetItemRead",
    "FleetItemUpdate",
    "RoomInventoryCreate",
    "RoomInventoryRead",
    "RoomInventoryUpdate",
    "TourSlotCreate",
    "TourSlotRead",
    "TourSlotUpdate",
]
