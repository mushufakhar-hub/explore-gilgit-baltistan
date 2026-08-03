"""initial_taxonomy_and_listing_tables

Revision ID: 202608010001
Revises: 
Create Date: 2026-08-01 00:00:00.000000
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "202608010001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "category_groups",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_category_groups_slug"), "category_groups", ["slug"], unique=False)

    op.create_table(
        "categories",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("group_id", sa.String(length=64), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "kind",
            sa.Enum("BUSINESS", "POI", name="listing_kind", native_enum=False),
            nullable=False,
            server_default="BUSINESS",
        ),
        sa.Column(
            "booking_model",
            sa.Enum(
                "NONE",
                "TABLE_RESERVATION",
                "ROOM_AVAILABILITY",
                "FLEET_AVAILABILITY",
                "SLOT_BASED",
                name="booking_model",
                native_enum=False,
            ),
            nullable=False,
            server_default="NONE",
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.ForeignKeyConstraint(["group_id"], ["category_groups.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("group_id", "slug"),
    )
    op.create_index(op.f("ix_categories_group_id"), "categories", ["group_id"], unique=False)
    op.create_index(op.f("ix_categories_slug"), "categories", ["slug"], unique=False)
    op.create_index(op.f("ix_categories_kind"), "categories", ["kind"], unique=False)
    op.create_index(op.f("ix_categories_booking_model"), "categories", ["booking_model"], unique=False)

    op.create_table(
        "listings",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("category_id", sa.String(length=64), nullable=False),
        sa.Column("owner_id", sa.String(length=64), nullable=True),
        sa.Column("name", sa.String(length=240), nullable=False),
        sa.Column("slug", sa.String(length=240), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("country", sa.String(length=120), nullable=True),
        sa.Column("region", sa.String(length=120), nullable=True),
        sa.Column("city", sa.String(length=120), nullable=True),
        sa.Column("address_line_1", sa.String(length=255), nullable=True),
        sa.Column("address_line_2", sa.String(length=255), nullable=True),
        sa.Column("postal_code", sa.String(length=40), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("phone", sa.String(length=40), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("website", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=40), nullable=False, server_default="draft"),
        sa.Column(
            "verification_status",
            sa.String(length=40),
            nullable=False,
            server_default="unverified",
        ),
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("seo_title", sa.String(length=255), nullable=True),
        sa.Column("seo_description", sa.Text(), nullable=True),
        sa.Column("canonical_url", sa.String(length=255), nullable=True),
        sa.Column("attributes", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
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
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_listings_category_id"), "listings", ["category_id"], unique=False)
    op.create_index(op.f("ix_listings_owner_id"), "listings", ["owner_id"], unique=False)
    op.create_index(op.f("ix_listings_name"), "listings", ["name"], unique=False)
    op.create_index(op.f("ix_listings_slug"), "listings", ["slug"], unique=False)
    op.create_index(op.f("ix_listings_status"), "listings", ["status"], unique=False)
    op.create_index(
        op.f("ix_listings_verification_status"),
        "listings",
        ["verification_status"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_listings_verification_status"), table_name="listings")
    op.drop_index(op.f("ix_listings_status"), table_name="listings")
    op.drop_index(op.f("ix_listings_slug"), table_name="listings")
    op.drop_index(op.f("ix_listings_name"), table_name="listings")
    op.drop_index(op.f("ix_listings_owner_id"), table_name="listings")
    op.drop_index(op.f("ix_listings_category_id"), table_name="listings")
    op.drop_table("listings")

    op.drop_index(op.f("ix_categories_booking_model"), table_name="categories")
    op.drop_index(op.f("ix_categories_kind"), table_name="categories")
    op.drop_index(op.f("ix_categories_slug"), table_name="categories")
    op.drop_index(op.f("ix_categories_group_id"), table_name="categories")
    op.drop_table("categories")

    op.drop_index(op.f("ix_category_groups_slug"), table_name="category_groups")
    op.drop_table("category_groups")

    sa.Enum(name="booking_model").drop(op.get_bind(), checkfirst=False)
    sa.Enum(name="listing_kind").drop(op.get_bind(), checkfirst=False)
