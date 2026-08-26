from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    designation: Optional[str] = "Statistical Professional"
    department: Optional[str] = "MoSPI"
    organization: Optional[str] = "Government of India"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str # email
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    organization: Optional[str] = None

class UserOut(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    user_id: Optional[int] = None
