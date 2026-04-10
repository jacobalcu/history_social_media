# Feed, creating posts, historical tags
# User profiles, follows
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
from app.crud import crud_article
from app.db.database import get_db
from app.db.redis import redis_client
from app.api.auth import get_current_user_id
from typing import List
import logging


# Default route will be /articles
router = APIRouter()

# Create new article
@router.post("/", response_model=ArticleResponse)
async def create_article(article: ArticleCreate, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Create article, connect to user_id
    new_article = crud_article.create_article(db, article, user_id)

    # Delete from cache so next person to load gets new data
    try:
        await redis_client.delete("explore_feed")
    except Exception as e:
        # If Redis is offline, log the error but don't crash the server.
        logging.error(f"Redis cache invalidation failed: {e}")    
    
    return new_article

@router.get("/{article_id}")
def get_article(article_id: UUID, db: Session = Depends(get_db)):
    # Get article by id
    article = crud_article.get_one_article(db, article_id)
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    safe_article = ArticleResponse.model_validate(article)
    number_likes = crud_article.get_article_likes(db, article_id)
    return {
        "likes": number_likes,
        "article":safe_article
    }

@router.get("/{article_id}/like-status")
def check_article_like_status(
    article_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user_id)
):
    raw_result = crud_article.check_if_liked(db, article_id, current_user_id)

    return {"is_liked": bool(raw_result)}

# Delete article
@router.delete("/{article_id}")
async def delete_article(article_id: UUID, db: Session = Depends(get_db), user_id: UUID = Depends(get_current_user_id)):
    # Get article by id
    wasDeleted = crud_article.delete_article(db, article_id, user_id)
    
    if not wasDeleted:
        raise HTTPException(status_code=404, detail="Delete Failed")

    # Delete from cache so next person to load gets new data
    try:
        await redis_client.delete("explore_feed")
    except Exception as e:
        # If Redis is offline, log the error but don't crash the server.
        logging.error(f"Redis cache invalidation failed: {e}") 
    
    return {"message": "Article deleted successfully"}

# Put implies "replace whole thing"
# Patch implies "partially update"
@router.patch("/{article_id}", response_model=ArticleResponse)
async def update_article(article_id: UUID, article_update: ArticleUpdate, db: Session = Depends(get_db), user_id: UUID = Depends(get_current_user_id)):
    article = crud_article.update_article(db, article_id, user_id, article_update)

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Delete from cache so next person to load gets new data
    try:
        await redis_client.delete("explore_feed")
    except Exception as e:
        # If Redis is offline, log the error but don't crash the server.
        logging.error(f"Redis cache invalidation failed: {e}") 
    
    return article


# Will insert row into article_likes table containing user id and article id
@router.post("/{article_id}/toggle-like")
def toggle_like(article_id: UUID, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Increment likes on article
    # Make sure not already liked
    # Add to users liked
    response = crud_article.toggle_like(db, article_id, user_id)
    return response

# Use query parameter (/search?q=rome&skip=0&limit=10)
@router.get("/search", response_model=List[ArticleResponse])
async def search_articles(
    q: str = Query(..., min_length=2, description="Search query"),
    skip: int = 0, limit: int = 10, 
    db: Session = Depends(get_db)
):
    articles = crud_article.search_articles(db=db, search_query=q, skip=skip, limit=limit)
    return articles






