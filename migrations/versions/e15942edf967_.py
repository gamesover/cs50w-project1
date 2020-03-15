"""empty message

Revision ID: e15942edf967
Revises: 30db2293ca83
Create Date: 2018-12-16 23:46:48.586950

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e15942edf967'
down_revision = '30db2293ca83'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('review', sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('review', 'updated_at')
    # ### end Alembic commands ###