"""questionnaire metadata + rename submissions to user_responses

Revision ID: c4d5e6f7a8b0
Revises: 8a2c1e9b4f0d
Create Date: 2026-04-09

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "c4d5e6f7a8b0"
down_revision: str | None = "8a2c1e9b4f0d"
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.create_table(
        "questionnaire_metadata",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("questionnaire_id", sa.String(length=128), nullable=False),
        sa.Column("content_version", sa.String(length=64), nullable=False),
        sa.Column("storage_key", sa.String(length=512), nullable=False),
        sa.Column("s3_etag", sa.String(length=128), nullable=True),
        sa.Column("content_sha256", sa.String(length=64), nullable=False),
        sa.Column("raw_bytes_length", sa.Integer(), nullable=False),
        sa.Column(
            "fetched_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "questionnaire_id",
            "content_version",
            name="uq_qmeta_qid_version",
        ),
    )
    op.create_index(
        "ix_questionnaire_metadata_questionnaire_id",
        "questionnaire_metadata",
        ["questionnaire_id"],
        unique=False,
    )

    op.add_column(
        "questionnaire_submissions",
        sa.Column("questionnaire_version", sa.String(length=64), nullable=True),
    )
    op.execute(
        sa.text(
            "UPDATE questionnaire_submissions SET questionnaire_version = '1.0.0' "
            "WHERE questionnaire_version IS NULL"
        )
    )
    op.alter_column(
        "questionnaire_submissions",
        "questionnaire_version",
        nullable=False,
        server_default="1.0.0",
    )

    op.rename_table("questionnaire_submissions", "user_responses")
    op.execute(
        sa.text(
            "ALTER INDEX IF EXISTS ix_questionnaire_submissions_questionnaire_id "
            "RENAME TO ix_user_responses_questionnaire_id"
        )
    )
    op.execute(
        sa.text(
            "ALTER INDEX IF EXISTS ix_questionnaire_submissions_user_id "
            "RENAME TO ix_user_responses_user_id"
        )
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            "ALTER INDEX IF EXISTS ix_user_responses_questionnaire_id "
            "RENAME TO ix_questionnaire_submissions_questionnaire_id"
        )
    )
    op.execute(
        sa.text(
            "ALTER INDEX IF EXISTS ix_user_responses_user_id "
            "RENAME TO ix_questionnaire_submissions_user_id"
        )
    )
    op.rename_table("user_responses", "questionnaire_submissions")
    op.drop_column("questionnaire_submissions", "questionnaire_version")
    op.drop_index("ix_questionnaire_metadata_questionnaire_id", table_name="questionnaire_metadata")
    op.drop_table("questionnaire_metadata")
