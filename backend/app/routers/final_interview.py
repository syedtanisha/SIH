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
)
from ..services.ai_service import evaluate_final_interview_answer


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
@router.post("/evaluate-answer")
async def evaluate_answer(
    data: dict,
    current_user: User = Depends(get_current_user)
):
    result = await evaluate_final_interview_answer(
        question=data.get("question", ""),
        answer=data.get("answer", ""),
        competency=data.get("competency", ""),
        domain=data.get("domain", ""),
        difficulty=data.get("difficulty", "Intermediate")
    )

    return result