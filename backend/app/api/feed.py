from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.crud import crud_article

from app.schemas.article import ArticleResponse
from app.db.database import get_db
from app.api.auth import get_current_user_id

# The prefix for this router in main.py will likely be /feed
router = APIRouter()

# Feed from followed accounts
@router.get("/", response_model=List[ArticleResponse])
def get_user_feed(
    skip: int = 0, 
    limit: int = 20, 
    current_user_id: UUID = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    # Retrieves the chronological feed of articles from users 
    # that the currently authenticated user follows.  
    articles = crud_article.get_personal_feed(db, current_user_id, skip, limit)
    return articles



@router.get("/explore", response_model=List[ArticleResponse])
def get_explore_feed(
    skip: int = 0, 
    limit: int = 20, 
    db: Session = Depends(get_db)
):
    # Retrieves a global, chronological feed of all articles.
    # Does not require authentication (public view)
    articles = crud_article.get_explore_feed(db, skip, limit)
    return articles