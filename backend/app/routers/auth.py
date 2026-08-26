from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..schemas.user import UserCreate, UserLogin, UserOut, Token, UserUpdate
from ..services.auth_service import register_user, authenticate_user
from ..core.security import get_current_user
from ..models.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    new_user = register_user(user_in, db)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    login_data = UserLogin(username=form_data.username, password=form_data.password)
    return authenticate_user(login_data, db)

@router.post("/login/json", response_model=Token)
def login_json(login_data: UserLogin, db: Session = Depends(get_db)):
    return authenticate_user(login_data, db)

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.full_name is not None:
        current_user.full_name = profile_data.full_name
    if profile_data.designation is not None:
        current_user.designation = profile_data.designation
    if profile_data.department is not None:
        current_user.department = profile_data.department
    if profile_data.organization is not None:
        current_user.organization = profile_data.organization
    db.commit()
    db.refresh(current_user)
    return current_user
