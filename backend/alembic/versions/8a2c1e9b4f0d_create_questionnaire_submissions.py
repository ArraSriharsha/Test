"""create questionnaire_submissions

Revision ID: 8a2c1e9b4f0d
Revises: 227746f83acf
Create Date: 2026-04-09

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "8a2c1e9b4f0d"
down_revision: str | None = "227746f83acf"
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.create_table(
        "questionnaire_submissions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("questionnaire_id", sa.String(length=128), nullable=False),
        sa.Column("answers", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("result_bundle", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_questionnaire_submissions_questionnaire_id"),
        "questionnaire_submissions",
        ["questionnaire_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_questionnaire_submissions_user_id"),
        "questionnaire_submissions",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_questionnaire_submissions_user_id"),
        table_name="questionnaire_submissions",
    )
    op.drop_index(
        op.f("ix_questionnaire_submissions_questionnaire_id"),
        table_name="questionnaire_submissions",
    )
    op.drop_table("questionnaire_submissions")
