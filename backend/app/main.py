from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, articles, feed

app = FastAPI(
    title="History Social Media API",
    description="Backend for historical timeline social network",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],    allow_credentials = True,
    allow_methods=["*"], # allows GET, POST, PUT, DELETE, etc
    allow_headers=["*"], # Allows all headers (like our Authorization header)
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(articles.router, prefix="/api/articles", tags=["Articles"])
app.include_router(feed.router, prefix="/api/feed", tags=["Feed"])



@app.get("/")
def read_root():
    return {"status": "success", "message":"The History API is live"}
