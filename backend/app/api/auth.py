# Login, registration, JWT generation
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.db.database import get_db
from app.crud import crud_user
from app.core.security import verify_password, create_access_token, SECRET_KEY, ALGORITHM
import jwt
from fastapi.security import OAuth2PasswordBearer
from uuid import UUID

router = APIRouter()

# FastAPI passes user model thru UserResponse before returning user
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check username and email, both must be unique
    try_email = crud_user.get_user_by_email(db, user.email)
    if try_email:
        raise HTTPException(status_code=400, detail="Email already taken")
    try_username = crud_user.get_user_by_username(db, user.username)
    if try_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    new_user = crud_user.create_user(db, user)
    return new_user


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Check if user w/ username exists
    try_user = crud_user.get_user_by_username(db, user.username)

    # If not, raise exception
    if not try_user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    # Check if passwords match
    if not verify_password(user.password, try_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    # Assign access token later
    access_token = create_access_token({"sub": str(try_user.id)})

    return {"access_token":access_token, "token_type":"bearer"}

# Tells FastAPI to look for token in "Authorization" header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        # Decode the token using our secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Extract user ID (stored under "sub")
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401, detail="Could not validate credentials"
            )
        return UUID(user_id)

    except jwt.InvalidTokenError:
        # If token is expired or tampered, jose throws JWTError
        raise HTTPException(status_code=401, detail="Could not validate credentials")
