from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models.models import User, Competency, UserCompetency
from ..schemas.user import UserCreate, UserLogin, UserOut, Token
from ..core.security import hash_password, verify_password, create_access_token

def register_user(user_data: UserCreate, db: Session) -> User:
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An officer/user with this email is already registered."
        )
    
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_pwd,
        full_name=user_data.full_name,
        designation=user_data.designation or "Statistical Professional",
        department=user_data.department or "MoSPI",
        organization=user_data.organization or "Government of India",
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize user competency baseline records with initial 0% level
    all_competencies = db.query(Competency).all()
    for comp in all_competencies:
        uc = UserCompetency(
            user_id=new_user.id,
            competency_id=comp.id,
            current_level=0.0,
            assessment_source="initial"
        )
        db.add(uc)
    db.commit()

    return new_user

def authenticate_user(login_data: UserLogin, db: Session) -> Token:
    user = db.query(User).filter(User.email == login_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your email and password."
        )
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your email and password."
        )
    
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    user_out = UserOut.model_validate(user)
    return Token(access_token=token, token_type="Bearer", user=user_out)
