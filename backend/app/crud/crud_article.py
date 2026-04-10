# This file holds reusable db functions for articles
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.article import Article
from app.models.associations import article_likes, user_follows
from app.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
from datetime import datetime
from typing import Optional
from sqlalchemy import insert, delete, func

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
        .filter(
            Article.author_id == author_id,
            ~Article.is_deleted)\
        .order_by(Article.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return articles

# Get explore feed
# Add skip and limit for pagination
def get_explore_feed(db: Session, skip: int = 0, limit: int = 10):
    articles = db.query(Article)\
        .filter(~Article.is_deleted)\
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
        .filter(
            Article.author_id.in_(following_subquery),
            ~Article.is_deleted)\
        .order_by(Article.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
        
    return articles

# Get article by id
def get_one_article(db: Session, article_id: UUID):
    articles = db.query(Article).filter(
        Article.id == article_id,
        ~Article.is_deleted)
    return articles.first()

#Search by tag
def get_articles_by_tag(db: Session, tag: str, skip: int = 0, limit: int = 10):
    articles = db.query(Article)\
        .filter(
            Article.tags.any(tag), # Checks if tag is in array
            ~Article.is_deleted
        )\
        .order_by(Article.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return articles

# Update article
def update_article(db: Session, article_id: UUID, user_id: UUID, article_update: ArticleUpdate):
    article = db.query(Article).filter(
        Article.id == article_id,
        Article.author_id == user_id,
        ~Article.is_deleted).first()
    
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
        Article.author_id == user_id,
        ~Article.is_deleted).first()

    if not del_article:
        return False

    del_article.is_deleted = True
    db.commit()

    return True
    
    

# Return number likes an article has
def get_article_likes(db: Session, article_id: UUID):
    return db.query(article_likes).filter(
        article_likes.c.article_id == article_id
    ).count()

# Check if user already liked the article
def check_if_liked(db: Session, article_id: UUID, user_id: UUID):
    already_liked = db.query(article_likes).filter(
        article_likes.c.article_id == article_id,
        article_likes.c.user_id == user_id
    )

    return already_liked.first()

    

# Like/unlike an article
def toggle_like(db: Session, article_id: UUID, user_id: UUID):
    # Check if user already liked
    existing_like = check_if_liked(db, article_id, user_id)

    # If user already liked
    if existing_like:
        # Unlike
        stmt = delete(article_likes).where(
            article_likes.c.article_id == article_id,
            article_likes.c.user_id == user_id
        )
        db.execute(stmt)
        db.commit()
        return {"is_liked": False}
    else: # User hasn't like the article
        # Like it
        stmt = insert(article_likes).values(
            article_id=article_id, 
            user_id=user_id
        )
        db.execute(stmt)
        db.commit()
        return {"is_liked": True}


def search_articles(db: Session, search_query: str, skip: int = 0, limit: int = 10):
    # Convert user strings into tsquery
    query_vector = func.plainto_tsquery('english', search_query)

    # Use @@ operator to find matches
    # Order by rank
    results = db.query(Article)\
        .filter(Article.search_vector.op('@@')(query_vector))\
        .order_by(func.ts_rank(Article.search_vector, query_vector).desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    return results