from sqlalchemy.orm import Session
from uuid import UUID

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password 

def get_user_by_id(db: Session, user_id: UUID):
    # Query the database for a user matching this exact UUID
    users = db.query(User).filter(User.id == user_id)
    return users.first()

def get_user_by_email(db: Session, email: str):
    # Required to check if an email is already registered during signup
    users = db.query(User).filter(User.email == email)
    return users.first()

def get_user_by_username(db: Session, username: str):
    # Required for the dynamic /{username} profile routes
    users = db.query(User).filter(User.username == username)
    return users.first()

def create_user(db: Session, user: UserCreate):
    # 1. Hash the user.password using hash_password()
    hashed_pwd = hash_password(user.password)
    # 2. Create the models.User instance (don't save the plain password!)
    new_user = User(email=user.email, username=user.username, hashed_password = hashed_pwd)
    # 3. db.add(), db.commit(), and db.refresh()
    db.add(new_user)
    db.commit()
    db.refresh(new_user)    
    # 4. Return the new user object
    return new_user