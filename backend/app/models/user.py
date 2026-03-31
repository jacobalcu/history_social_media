from app.db.database import Base
from sqlalchemy import Column, Uuid, String, DateTime, func
from uuid import uuid4
from sqlalchemy.orm import relationship
from app.models.associations import article_likes, user_follows

class User(Base):
    __tablename__ = 'users'
    # Store UUID as string
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    # Store username and emails as unique strings
    email = Column(String(255), unique=True)
    username = Column(String(50), unique=True, nullable=False)
    bio = Column(String)
    hashed_password = Column(String, nullable=False)

    # Auto get DB timestamp
    # server_default lets postgres handle timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    liked_articles = relationship(
        "Article", secondary=article_likes, back_populates="likers"
    )

    following = relationship(
        "User", secondary=user_follows, 
        primaryjoin=id == user_follows.c.follower_id,
        secondaryjoin=id == user_follows.c.followed_id, 
        backref="followers"
    )
