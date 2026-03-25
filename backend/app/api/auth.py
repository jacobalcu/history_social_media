# Login, registration, JWT generation
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse
from app.db.database import get_db

router = APIRouter()

# FastAPI passes user model thru UserResponse before returning
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    pass

@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    pass