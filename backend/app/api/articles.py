# Feed, creating posts, historical tags
# User profiles, follows
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.article import ArticleCreate, ArticleResponse
from app.db.database import get_db
from app.api.auth import get_current_user_id
from typing import List

# Default route will be /api/articles
router = APIRouter()

# Create new article
@router.post("/", response_model=ArticleResponse)
def create_article(article: ArticleCreate, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Create article, connect to user_id
    pass

@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: UUID, db: Session = Depends(get_db)):
    # Get article by id
    pass

# Will insert row into article_likes table containing user id and article id
@router.post("/{article_id}/like")
def like_article(article_id: UUID, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Increment likes on article
    # Make sure not already liked
    # Add to users liked
    pass

@router.delete("/{article_id}/like")
def unlike_article(article_id: UUID, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    # Make sure user liked
    # Decrement likes on article
    # Delete from user liked
    pass



