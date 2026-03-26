from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


# For incoming data during signup
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str = Field(..., min_length=8, max_length=72)

# For incoming data during signup
class UserLogin(BaseModel):
    username: str
    password: str

# Every field is optional
class UserUpdate(BaseModel):
    email: Optional[EmailStr]
    username: Optional[str]
    password: Optional[str]


# Response Schema: What API returns back to client
class UserResponse(BaseModel):
    id: UUID
    username: str
    created_at: datetime
    model_config = {"from_attributes": True}
