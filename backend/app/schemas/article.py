from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

# Base schema: Fields common to creating and reading
class ArticleBase(BaseModel):
    title: str
    content: str
    period_label: Optional[str]
    historical_year: int

# Create Schema: What user sends in POST request body
class ArticleCreate(ArticleBase):
    pass # Exact same as ArticleBase

# Update schema: Every field is Optional
class ArticleUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]
    period_label: Optional[str]
    historical_year: Optional[int]

# Response Schema: What API returns back to client
class ArticleResponse(ArticleBase):
    id: UUID
    author_id: UUID
    created_at: datetime

    # Tells Pydantic to read data even if it's not a dict
    model_config = {"from_attributes": True}


