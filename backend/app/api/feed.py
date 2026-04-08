from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.crud import crud_article

import json
from app.schemas.article import ArticleResponse
from app.db.database import get_db
from app.api.auth import get_current_user_id
from app.db.redis import redis_client
from fastapi.encoders import jsonable_encoder

# The prefix for this router in main.py will likely be /feed
router = APIRouter()

# Feed from followed accounts
@router.get("/", response_model=List[ArticleResponse])
def get_user_feed(
    skip: int = 0, 
    limit: int = 10, 
    current_user_id: UUID = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    # Retrieves the chronological feed of articles from users 
    # that the currently authenticated user follows.  
    articles = crud_article.get_personal_feed(db, current_user_id, skip, limit)
    return articles



@router.get("/explore", response_model=List[ArticleResponse])
async def get_explore_feed(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db)
):
    # Check the cache
    # await async call for "explore_feed" key
    cached_feed = await redis_client.get("explore_feed")

    if cached_feed:
        print("Serving from Redis cache")
        # Convert from JSON string back to Python list and return instantly
        return json.loads(cached_feed)

    print("Serving from PostgreSQL")
    # Retrieves a global, chronological feed of all articles.
    # Does not require authentication (public view)
    articles = crud_article.get_explore_feed(db, skip, limit)

    # Serialize and add to cache
    
    # jsonable_encoder strips away SQLAlchemy metadata and
    # converts things like Python datetime into standard strings
    serializable_data = jsonable_encoder(articles)
    # Convert into raw JSON string
    stringified_data = json.dumps(serializable_data)


    await redis_client.setex("explore_feed", 60, stringified_data)
    
    return serializable_data