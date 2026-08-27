from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..services.final_interview_service import (
    get_final_interview_readiness,
    generate_interview_questions,
)
from ..db.database import get_db
from ..models.models import User
from ..core.security import get_current_user
from ..schemas.final_interview import (
    FinalInterviewReadiness,
    FinalInterviewAnswerSubmit,
    FinalInterviewAnswerEvaluation,
    FinalInterviewReportRequest,
    FinalInterviewReportResponse
)
from ..services.ai_service import evaluate_final_interview_answer, generate_final_interview_report_async

router = APIRouter(
    prefix="/final-interview",
    tags=["Final AI Interview"]
)

@router.get(
    "/readiness",
    response_model=FinalInterviewReadiness
)
def get_readiness(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_final_interview_readiness(
        current_user.id,
        db
    )

@router.post("/questions")
async def generate_questions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await generate_interview_questions(
        current_user.id,
        db
    )

@router.post("/evaluate-answer", response_model=FinalInterviewAnswerEvaluation)
async def evaluate_answer(
    data: FinalInterviewAnswerSubmit,
    current_user: User = Depends(get_current_user)
):
    result = await evaluate_final_interview_answer(
        question=data.question,
        answer=data.answer,
        competency=data.competency,
        domain=data.domain,
        difficulty=data.difficulty
    )
    return result

@router.post("/generate-report", response_model=FinalInterviewReportResponse)
async def generate_report(
    data: FinalInterviewReportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    raw_results = [r.dict() for r in data.results]
    report = await generate_final_interview_report_async(
        officer_name=current_user.full_name,
        designation=current_user.designation or "Statistical Officer",
        division=current_user.department or "MoSPI",
        results=raw_results
    )
    return report