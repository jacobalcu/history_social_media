from app.db.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Uuid, String, DateTime, func, ForeignKey, Integer, Text
from uuid import uuid4
from app.models.associations import article_likes

class Article(Base):
    __tablename__ = 'articles'
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    author_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)

    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    period_label = Column(String(40))

    # BC will be negative
    historical_year = Column(Integer)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Allows easy python access later
    # e.g. article.author.username
    author = relationship("User")

    likers = relationship(
        "User", secondary=article_likes, back_populates="liked_articles"
    )
