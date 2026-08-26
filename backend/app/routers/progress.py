from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.models import User
from ..schemas.progress import ProgressSummaryOut
from ..core.security import get_current_user
from ..services.progress_service import get_user_progress_summary

router = APIRouter(prefix="/progress", tags=["Progress & Longitudinal Growth"])

@router.get("/summary", response_model=ProgressSummaryOut)
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_progress_summary(current_user.id, db)
