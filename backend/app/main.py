from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, articles, feed, notifications

app = FastAPI(
    title="History Social Media API",
    description="Backend for historical timeline social network",
    version="0.1.0"
)

origins = [
    # Local
    "http://localhost:5173", 
    "http://127.0.0.1:5173",

    # Production
    "https://history-social-media.vercel.app",
    "https://kairoshistory.com",     
    "https://www.kairoshistory.com"   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    
    allow_credentials = True,
    allow_methods=["*"], # allows GET, POST, PUT, DELETE, etc
    allow_headers=["*"], # Allows all headers (like our Authorization header)
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(articles.router, prefix="/articles", tags=["Articles"])
app.include_router(feed.router, prefix="/feed", tags=["Feed"])
app.include_router(notifications.router, prefix="/ws", tags=["Notifications"])



@app.get("/")
def read_root():
    return {"status": "success", "message":"The History API is live"}
