from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.models import User
from ..schemas.assessment import (
    BaselineAssessmentOut,
    BaselineAssessmentSubmit,
    BaselineAssessmentResultOut
)
from ..core.security import get_current_user
from ..services.assessment_service import (
    get_baseline_assessment_data,
    evaluate_baseline_submission
)

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.get("/baseline", response_model=BaselineAssessmentOut)
def get_baseline_assessment(current_user: User = Depends(get_current_user)):
    return get_baseline_assessment_data()

@router.post("/baseline/submit", response_model=BaselineAssessmentResultOut)
def submit_baseline_assessment(
    submission: BaselineAssessmentSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return evaluate_baseline_submission(current_user.id, submission, db)
