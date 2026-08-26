from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentUploadResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size_bytes: int
    character_count: int
    preview_text: str
    created_at: datetime
    message: str

class DocumentOut(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size_bytes: int
    character_count: int
    created_at: datetime

    class Config:
        from_attributes = True
