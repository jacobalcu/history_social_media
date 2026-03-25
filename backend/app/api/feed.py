from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.schemas.article import ArticleResponse
from app.db.database import get_db
from app.api.auth import get_current_user_id

# The prefix for this router in main.py will likely be /api/feed
router = APIRouter()

@router.get("/", response_model=List[ArticleResponse])
def get_user_feed(
    skip: int = 0, 
    limit: int = 20, 
    current_user_id: UUID = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    """
    Retrieves the chronological feed of articles from users 
    that the currently authenticated user follows.
    """
    # TODO: 
    # 1. Identify who current_user_id follows.
    # 2. Fetch articles authored by those users.
    # 3. Order the articles by 'created_at' descending (newest first).
    # 4. Apply 'skip' and 'limit' for pagination.
    # 5. Return the list of articles.
    pass

@router.get("/explore", response_model=List[ArticleResponse])
def get_explore_feed(
    skip: int = 0, 
    limit: int = 20, 
    db: Session = Depends(get_db)
):
    """
    Retrieves a global, chronological feed of all articles.
    Does not require authentication (public view).
    """
    # TODO:
    # 1. Fetch all articles from the database.
    # 2. Order by 'created_at' descending.
    # 3. Apply pagination.
    pass