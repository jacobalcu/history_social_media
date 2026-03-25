# User profiles, follows
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.article import ArticleCreate, ArticleResponse
from app.db.database import get_db
from app.api.auth import get_current_user_id
from typing import List

router = APIRouter()



# Edit user info
@router.put("/profile", response_model=UserResponse)
def edit_profile(user_update: UserUpdate, db: Session = Depends(get_db), user_id: UUID = Depends(get_current_user_id)):
    pass

# Return user info
@router.get("/{username}", response_model=UserResponse)
def get_profile(username: str, db: Session = Depends(get_db)):
    pass

# Get user articles
@router.get("/{username}/articles", response_model=List[ArticleResponse])
def get_user_articles(username: str, db: Session = Depends(get_db)):
    pass

# Follow user
@router.post("/{username}/follow")
def follow_user(username: str, db: Session = Depends(get_db), user_id: UUID = Depends(get_current_user_id)):
    pass

# Unfollow user
@router.delete("/{username}/follow")
def unfollow_user(username: str, db: Session = Depends(get_db), user_id: UUID = Depends(get_current_user_id)):
    pass

# Get all liked posts for user
@router.get("/{username}/likes")
def get_liked(db: Session = Depends(get_db), user_id: UUID = Depends(get_current_user_id)):
    # Ensure username is same as authenticated user
    # Query DB for user_id liked posts
    pass