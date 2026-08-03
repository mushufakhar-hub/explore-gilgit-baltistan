"""add payment event table

Revision ID: 202608010003
Revises: 202608010002
Create Date: 2026-08-01 00:30:00.000000
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "202608010003"
down_revision = "202608010002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "payment_events",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("booking_id", sa.String(length=64), nullable=False),
        sa.Column("provider", sa.String(length=40), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("idempotency_key", sa.String(length=128), nullable=False),
        sa.Column("raw_payload", sa.Text(), nullable=False),
        sa.Column("signature", sa.String(length=255), nullable=True),
        sa.Column("is_processed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
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
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("idempotency_key"),
    )
    op.create_index(op.f("ix_payment_events_booking_id"), "payment_events", ["booking_id"], unique=False)
    op.create_index(op.f("ix_payment_events_provider"), "payment_events", ["provider"], unique=False)
    op.create_index(op.f("ix_payment_events_status"), "payment_events", ["status"], unique=False)
    op.create_index(op.f("ix_payment_events_idempotency_key"), "payment_events", ["idempotency_key"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_payment_events_idempotency_key"), table_name="payment_events")
    op.drop_index(op.f("ix_payment_events_status"), table_name="payment_events")
    op.drop_index(op.f("ix_payment_events_provider"), table_name="payment_events")
    op.drop_index(op.f("ix_payment_events_booking_id"), table_name="payment_events")
    op.drop_table("payment_events")
