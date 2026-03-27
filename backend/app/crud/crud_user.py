from sqlalchemy.orm import Session
from uuid import UUID
from app.models.associations import user_follows
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password 

def get_user_by_id(db: Session, user_id: UUID):
    # Query the database for a user matching this exact UUID
    users = db.query(User).filter(User.id == user_id)
    return users.first()

def get_followers(db: Session, user_id: UUID):
    pass

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

# Follow/unfollow a user
def toggle_follow(db: Session, other_user_id: UUID, user_id: UUID):
    # Prevent self-following
    if user_id == other_user_id:
        return {"message": "You cannot follow yourself", "followed": False}
    
    # Check if user already follows
    following = db.query(user_follows).filter(
        user_follows.c.follower_id == user_id,
        user_follows.c.followed_id == other_user_id
    )

    already_following = following.first()

    # If user already follows
    if already_following:
        # Unfollow
        statement = user_follows.delete().where(
            (user_follows.c.follower_id==user_id) &
            (user_follows.c.followed_id==other_user_id)
        )
        message = "Person unfollowed"
        followed_status = False
    else: # User hasn't like the article
        # Like it
        statement = user_follows.insert().values(
            follower_id=user_id,
            followed_id=other_user_id
        )
        message = "Person followed"
        followed_status = True
    
    db.execute(statement)
    db.commit()

    # Return the new state so the frontend knows what to display
    return {"message": message, "followed": followed_status} 