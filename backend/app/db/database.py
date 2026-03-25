from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Replace with your actual PostgreSQL credentials later
# Added psycopg this time as it is the newer version
# Format: postgresql+psycopg://user:password@localhost:5432/dbname
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg://postgres:password@localhost:5432/history_db"

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