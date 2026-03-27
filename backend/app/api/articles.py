# Feed, creating posts, historical tags
# User profiles, follows
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.article import ArticleCreate, ArticleResponse
from app.crud import crud_article
from app.db.database import get_db
from app.api.auth import get_current_user_id
from typing import List

# Default route will be /api/articles
router = APIRouter()

# Create new article
@router.post("/", response_model=ArticleResponse)
def create_article(article: ArticleCreate, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Create article, connect to user_id
    new_article = crud_article.create_article(db, article, user_id)
    return new_article

@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: UUID, db: Session = Depends(get_db)):
    # Get article by id
    article = crud_article.get_one_article(db, article_id)
    return article

# Delete article
@router.delete("/{article_id}")
def delete_article(article_id: UUID, db: Session = Depends(get_db), user_id: UUID = Depends(get_current_user_id)):
    # Get article by id
    wasDeleted = crud_article.delete_article(db, article_id, user_id)
    
    if not wasDeleted:
        raise HTTPException(status_code=404, detail="Delete Failed")
    
    return {"message": "Article deleted successfully"}

# Put implies "replace whole thing"
# Patch implies "partially update"
@router.patch("/{article_id}", response_model=ArticleResponse)
def update_article(article_id: UUID, article_update: ArticleUpdate, db: Session = Depends(get_db), user_id: UUID = Depends(get_current_user_id)):
    article = crud_article.update_article(db, article_id, user_id, article_update)

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return article

# Get the feed
# Public so no need for user_id
@router.get("/explore", response_model=list[ArticleResponse])
def get_explore_feed(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    articles = crud_article.get_explore_feed(db, skip, limit)
    return articles


# Will insert row into article_likes table containing user id and article id
@router.post("/{article_id}/toggle-like")
def toggle_like(article_id: UUID, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Increment likes on article
    # Make sure not already liked
    # Add to users liked
    response = crud_article.toggle_like(db, article_id, user_id)
    return response






