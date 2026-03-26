# Security utility funcs
from typing_extensions import deprecated
from datetime import datetime, timedelta
from jose import jwt
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256") # The second argument is a default fallback!
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_pwd: str, hashed_pwd: str) -> str:
    return pwd_context.verify(plain_pwd, hashed_pwd)

def hash_password(password: str) -> bool:
    return pwd_context.hash(password)