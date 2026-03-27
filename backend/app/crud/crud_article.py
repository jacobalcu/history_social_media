# This file holds reusable db functions for articles
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.article import Article
from app.models.associations import article_likes
from app.schemas.article import ArticleCreate, ArticleResponse
from datetime import datetime
from typing import Optional

def create_article(db: Session, article: ArticleCreate, user_id: UUID):
    new_article = Article(
        author_id = user_id,
        **article.model_dump() # Auto unpack other vars
    )

    db.add(new_article)
    db.commit()
    db.refresh(new_article)

    return new_article

# Get all articles from one author
# Add skip and limit for pagination
def get_articles(db: Session, user_id: UUID, skip: int, limit: int):
    articles = db.query(Article).filter(Article.author_id == user_id)
    return articles.all()

# Get article by id
def get_one_article(db: Session, article_id: UUID):
    articles = db.query(Article).filter(Article.id == article_id)
    return articles.first()

# Get all articles, ordered, also paginated

# Update article


# Delete article 
def delete_article(db: Session, article_id: UUID, user_id: UUID):
    del_article = db.query(Article).filter(
        Article.id == article_id,
        Article.author_id == user_id).first()

    if del_article:
        db.delete(del_article)
        db.commit()
        return True
    
    return False
    

# Like/unlike an article
def toggle_like(db: Session, article_id: UUID, user_id: UUID):
    # Check if user already liked
    user_likes = db.query(article_likes).filter(
        article_likes.c.user_id == user_id,
        article_likes.c.article_id == article_id
    )

    # If user already liked
    if user_likes.first():
        # Unlike
        statement = article_likes.delete().where(
            (article_likes.c.user_id==user_id) &
            (article_likes.c.article_id==article_id)
        )
    else: # User hasn't like the article
        # Like it
        statement = article_likes.insert().values(
            user_id=user_id,
            article_id=article_id
        )
    
    db.execute(statement)
    db.commit()

    # Return the new state so the frontend knows what to display
    if user_likes.first():
        return {"message": "Article unliked", "liked": False}
    else:
        return {"message": "Article liked", "liked": True} 

