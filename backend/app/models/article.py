from app.db.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Column, Uuid, String, DateTime, func, ForeignKey, Integer, Text, Boolean, Computed, Index
from uuid import uuid4
from sqlalchemy.dialects.postgresql import TSVECTOR
from app.models.associations import article_likes


class Article(Base):
    __tablename__ = 'articles'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    author_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)

    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    period_label = Column(String(40))

    # Computed Column
    # persisted=True is saved to hard drive, becomes searchable
    search_vector = Column(
        TSVECTOR,
        Computed("to_tsvector('english', title || ' ' || coalesce(content, ''))",
        persisted=True)
    )

    # GIN Index on the new column
    __table_args__ = (
        Index('ix_article_search_vector', 'search_vector', postgresql_using='gin'),
    )

    # BC will be negative
    historical_year = Column(Integer)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Need index since we have to access this for crud operations
    is_deleted = Column(Boolean, default=False, server_default="false", index=True)
    # Allows easy python access later
    # e.g. article.author.username
    author = relationship("User")

    likers = relationship(
        "User", secondary=article_likes, back_populates="liked_articles"
    )
