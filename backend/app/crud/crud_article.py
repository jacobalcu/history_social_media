# This file holds reusable db functions for articles
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.article import Article
from app.models.associations import article_likes, user_follows
from app.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
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
def get_author_articles(db: Session, author_id: UUID, skip: int = 0, limit: int = 10):
    articles = db.query(Article)\
        .filter(Article.author_id == author_id)\
        .order_by(Article.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return articles

# Get explore feed
# Add skip and limit for pagination
def get_explore_feed(db: Session, skip: int = 0, limit: int = 10):
    articles = db.query(Article)\
        .order_by(Article.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return articles

# Get following feed
# Add skip and limit for pagination
def get_personal_feed(db: Session, user_id: UUID, skip: int = 0, limit: int = 10):
    # Subquery
    following_subquery = db.query(user_follows.c.followed_id).filter(
        user_follows.c.follower_id == user_id
    )
    
    articles = db.query(Article)\
        .filter(Article.author_id.in_(following_subquery))\
        .order_by(Article.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
        
    return articles

# Get article by id
def get_one_article(db: Session, article_id: UUID):
    articles = db.query(Article).filter(Article.id == article_id)
    return articles.first()

# Get all articles, ordered, also paginated

# Update article
def update_article(db: Session, article_id: UUID, user_id: UUID, article_update: ArticleUpdate):
    article = db.query(Article).filter(
        Article.id == article_id,
        Article.author_id == user_id).first()
    
    # Return None so router knows it failed
    if not article:
        return None

    update_data = article_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(article, key, value)

    db.commit()
    db.refresh(article)

    return article
    


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

