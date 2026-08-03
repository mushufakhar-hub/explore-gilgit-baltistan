"""add listing extension tables

Revision ID: 202608010002
Revises: 202608010001
Create Date: 2026-08-01 00:15:00.000000
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "202608010002"
down_revision = "202608010001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "room_inventories",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("listing_id", sa.String(length=64), nullable=False),
        sa.Column("room_type", sa.String(length=80), nullable=False),
        sa.Column("room_name", sa.String(length=120), nullable=True),
        sa.Column("max_guests", sa.Integer(), nullable=True),
        sa.Column("bed_type", sa.String(length=80), nullable=True),
        sa.Column("size_sqft", sa.Integer(), nullable=True),
        sa.Column("rate_per_night", sa.Float(), nullable=True),
        sa.Column("currency", sa.String(length=8), nullable=True, server_default="PKR"),
        sa.Column("available_count", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.ForeignKeyConstraint(["listing_id"], ["listings.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_room_inventories_listing_id"), "room_inventories", ["listing_id"], unique=False)
    op.create_index(op.f("ix_room_inventories_room_type"), "room_inventories", ["room_type"], unique=False)

    op.create_table(
        "fleet_items",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("listing_id", sa.String(length=64), nullable=False),
        sa.Column("vehicle_type", sa.String(length=80), nullable=False),
        sa.Column("make", sa.String(length=80), nullable=True),
        sa.Column("model", sa.String(length=120), nullable=True),
        sa.Column("year", sa.Integer(), nullable=True),
        sa.Column("seats", sa.Integer(), nullable=True),
        sa.Column("transmission", sa.String(length=40), nullable=True),
        sa.Column("fuel_type", sa.String(length=40), nullable=True),
        sa.Column("daily_rate", sa.Float(), nullable=True),
        sa.Column("currency", sa.String(length=8), nullable=True, server_default="PKR"),
        sa.Column("is_available", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.ForeignKeyConstraint(["listing_id"], ["listings.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_fleet_items_listing_id"), "fleet_items", ["listing_id"], unique=False)
    op.create_index(op.f("ix_fleet_items_vehicle_type"), "fleet_items", ["vehicle_type"], unique=False)

    op.create_table(
        "tour_slots",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("listing_id", sa.String(length=64), nullable=False),
        sa.Column("slot_type", sa.String(length=80), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=True),
        sa.Column("start_time", sa.DateTime(timezone=True), nullable=True),
        sa.Column("end_time", sa.DateTime(timezone=True), nullable=True),
        sa.Column("available_seats", sa.Integer(), nullable=True),
        sa.Column("price_per_person", sa.Float(), nullable=True),
        sa.Column("currency", sa.String(length=8), nullable=True, server_default="PKR"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.ForeignKeyConstraint(["listing_id"], ["listings.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_tour_slots_listing_id"), "tour_slots", ["listing_id"], unique=False)
    op.create_index(op.f("ix_tour_slots_slot_type"), "tour_slots", ["slot_type"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_tour_slots_slot_type"), table_name="tour_slots")
    op.drop_index(op.f("ix_tour_slots_listing_id"), table_name="tour_slots")
    op.drop_table("tour_slots")

    op.drop_index(op.f("ix_fleet_items_vehicle_type"), table_name="fleet_items")
    op.drop_index(op.f("ix_fleet_items_listing_id"), table_name="fleet_items")
    op.drop_table("fleet_items")

    op.drop_index(op.f("ix_room_inventories_room_type"), table_name="room_inventories")
    op.drop_index(op.f("ix_room_inventories_listing_id"), table_name="room_inventories")
    op.drop_table("room_inventories")
