from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

# Base schema: Fields common to creating and reading
class ArticleBase(BaseModel):
    title: str
    content: str
    period_label: Optional[str] = None
    historical_year: Optional[int] = None

# Create Schema: What user sends in POST request body
class ArticleCreate(ArticleBase):
    pass # Exact same as ArticleBase

# Update schema: Every field is Optional
class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    period_label: Optional[str] = None
    historical_year: Optional[int] = None

# Response Schema: What API returns back to client
class ArticleResponse(ArticleBase):
    id: UUID
    author_id: UUID
    title: str
    content: str
    period_label: Optional[str] = None
    historical_year: Optional[int] = None
    created_at: datetime

    # Tells Pydantic to read data even if it's not a dict
    model_config = {"from_attributes": True}


