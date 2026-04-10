import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

# Import your FastAPI app instance (adjust the import path if needed)
from app.main import app 

# Create a synchronous test client
client = TestClient(app)

# This decorator tells Pytest we are testing asynchronous code
@pytest.mark.asyncio
# @patch intercepts the real redis_client.get and replaces it with a fake one
@patch("app.api.articles.redis_client.get", new_callable=AsyncMock)
async def test_explore_feed_cache_hit(mock_redis_get):
    
    # 1. SETUP: Tell the fake Redis what to return when the server asks for "explore_feed"
    # We are simulating a Master Slice with 2 fake history articles.
    fake_cached_data = """[
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "title": "The Fall of Rome",
            "content": "It fell.",
            "author_id": "987f6543-e21b-34c5-b678-426614174111",
            "created_at": "2026-04-09T12:00:00Z"
        },
        {
            "id": "223e4567-e89b-12d3-a456-426614174001",
            "title": "The Moon Landing",
            "content": "We landed.",
            "author_id": "987f6543-e21b-34c5-b678-426614174111",
            "created_at": "2026-04-09T13:00:00Z"
        }
    ]"""
    mock_redis_get.return_value = fake_cached_data

    # 2. ACTION: Simulate a user sending a GET request to the explore endpoint
    # We will ask for skip=0, limit=1
    response = client.get("/feed/explore?skip=0&limit=1")

    # 3. ASSERTION: Prove the code did exactly what it was supposed to do
    
    # Did the server return a 200 OK status?
    assert response.status_code == 200
    
    # Did it successfully slice the fake list and only return 1 item?
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "The Fall of Rome"

    # Did it actually try to check the cache using the correct key?
    mock_redis_get.assert_called_once_with("explore_feed")


@pytest.mark.asyncio
@patch("app.api.articles.redis_client.get", new_callable=AsyncMock)
@patch("app.api.articles.redis_client.setex", new_callable=AsyncMock)
@patch("app.api.articles.crud_article.get_explore_feed") # Synchronous mock!
async def test_explore_feed_cache_miss(mock_crud_get, mock_redis_setex, mock_redis_get):
    
    # 1. SETUP: Force a Cache Miss by making Redis return nothing
    mock_redis_get.return_value = None

    # We also have to fake the database response so we don't hit Supabase
    mock_crud_get.return_value = [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "title": "PostgreSQL Article",
            "content": "I came from the database.",
            "author_id": "987f6543-e21b-34c5-b678-426614174111",
            "created_at": "2026-04-09T12:00:00Z"
        }
    ]

    # 2. ACTION: Send the request
    response = client.get("/feed/explore?skip=0&limit=10")

    # 3. ASSERTION
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "PostgreSQL Article"

    # THE CRITICAL PROOF: Did the server follow the Cache-Aside architecture?
    mock_redis_get.assert_called_once_with("explore_feed") # 1. It checked the cache
    mock_crud_get.assert_called_once()                     # 2. It queried the DB
    mock_redis_setex.assert_called_once()                  # 3. It saved the result to Redis