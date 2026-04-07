from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Replace with your actual PostgreSQL credentials later
# Added psycopg this time as it is the newer version
# Format: postgresql+psycopg://user:password@localhost:5432/dbname
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# 3. Security Check: If it can't find a URL, crash immediately so you know something is wrong
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is missing!")
    
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the database session in our routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()