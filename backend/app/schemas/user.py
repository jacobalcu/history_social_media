from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


# For incoming data during signup
class UserCreate(BaseModel):
    email: Optional[EmailStr] = None
    username: str
    password: str = Field(..., min_length=8, max_length=72)

class UserLogin(BaseModel):
    username: str
    password: str

# Every field is optional
class UserUpdate(BaseModel):
    email: Optional[EmailStr]
    username: Optional[str]
    password: Optional[str]
    bio: Optional[str]


# Response Schema: What API returns back to client
class UserResponse(BaseModel):
    id: UUID
    username: str
    bio: Optional[str] = None
    created_at: datetime
    model_config = {"from_attributes": True}

# Private Response Schema: For the user's own settings/account page
class UserPrivateResponse(BaseModel):
    id: UUID
    email: EmailStr   # Email is kept strictly private here
    username: str
    bio: Optional[str] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class UserSlimResponse(BaseModel):
    id: UUID
    username: str

    model_config = {'from_attributes':True}
