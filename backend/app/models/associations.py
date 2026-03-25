# app/db/associations.py
from sqlalchemy import Column, ForeignKey, Table, Uuid
from app.db.database import Base 

article_likes = Table(
    "article_likes",
    Base.metadata,
    Column("user_id", Uuid, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("article_id", Uuid, ForeignKey("articles.id", ondelete="CASCADE"), primary_key=True)
)

user_follows = Table(
    "user_follows",
    Base.metadata,
    Column("follower_id", Uuid, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("followed_id", Uuid, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
)