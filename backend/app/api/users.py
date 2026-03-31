# User profiles, follows
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud import crud_user, crud_article
from app.schemas.user import UserResponse, UserUpdate, UserSlimResponse
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
@router.get("/{username}")
def get_profile(username: str, db: Session = Depends(get_db)):
    # Get User by username
    cur_user = crud_user.get_user_by_username(db, username)

    if not cur_user:
        raise HTTPException(status_code=404, detail="User not found")

    followers = crud_user.get_follower_count(db, cur_user.id)
    following = crud_user.get_following_count(db, cur_user.id)

    # Sanitize cur_user manually
    safe_user = UserResponse.model_validate(cur_user)

    return {
        "following": following,
        "followers": followers,
        "user": safe_user
    }


# Return user info w/ id
@router.get("/id/{user_id}")
def get_profile_by_id(user_id: UUID, db: Session = Depends(get_db)):
    # Get User by username
    cur_user = crud_user.get_user_by_id(db, user_id)

    if not cur_user:
        raise HTTPException(status_code=404, detail="User not found")

    followers = crud_user.get_follower_count(db, cur_user.id)
    following = crud_user.get_following_count(db, cur_user.id)

    # Sanitize cur_user manually
    safe_user = UserResponse.model_validate(cur_user)

    return {
        "following": following,
        "followers": followers,
        "user": safe_user
    }


# Get user articles
@router.get("/{username}/articles", response_model=List[ArticleResponse])
def get_user_articles(username: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_username(db, username)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_articles = crud_article.get_author_articles(db, user.id, skip, limit)

    return user_articles

# Unfollow user
@router.post("/{username}/follow")
def toggle_follow(username: str, db: Session = Depends(get_db), current_user_id: UUID = Depends(get_current_user_id)):
    target_user = crud_user.get_user_by_username(db, username)

    if not target_user:
        raise HTTPException(status_code=404, details="User not found")

    response = crud_user.toggle_follow(db, target_user.id, user_id=current_user_id)
    return response

# Check if current user if following the profile
@router.get("/{username}/follow-status")
def check_follow_status(
    username: str,
    db: Session = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user_id)
):
    target_user = crud_user.get_user_by_username(db, username)

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    target_user_id = target_user.id
    raw_result = crud_user.check_if_following(db, target_user_id, current_user_id)

    is_following = bool(raw_result)
    return {"is_following":is_following}



# Get user followers
# Frontend will get next "page" by changing url skip parameter
@router.get("/{username}/followers", response_model=List[UserSlimResponse])
def get_followers(username: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_username(db, username)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    followers_list = crud_user.get_followers_list(db, user.id, skip, limit)

    # Contains only id and usernames of followers
    return followers_list

# Get user following
# Frontend will get next "page" by changing url skip parameter
@router.get("/{username}/following", response_model=List[UserSlimResponse])
def get_following(username: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_username(db, username)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    following_list = crud_user.get_following_list(db, user.id, skip, limit)

    # Contains only id and usernames of followers
    return following_list

# Get all liked posts for user
@router.get("/{username}/likes")
def get_liked(db: Session = Depends(get_db), user_id: UUID = Depends(get_current_user_id)):
    # Ensure username is same as authenticated user
    # Query DB for user_id liked posts
    pass
