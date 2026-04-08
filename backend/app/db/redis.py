import redis.asyncio as redis
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")
# 3. Security Check: If it can't find a URL, crash immediately so you know something is wrong
if not REDIS_URL:
    raise ValueError("REDIS_URL environment variable is missing!")
    
# Create global async connection pool
redis_client = redis.from_url(
    REDIS_URL,
    encoding="utf-8",
    decode_responses=True # auto convert raw bytes into Python strings
    # Otherwise would return b'{"title": "Rome"}'
)