from sqlalchemy.orm import Session

from .ai_service import generate_final_interview_questions

from ..models.models import (
    User,
    Competency,
    UserCompetency,
    QuizAttempt,
)
from ..schemas.final_interview import (
    FinalInterviewReadiness,
    FinalInterviewCompetency,
)


def get_final_interview_readiness(
    user_id: int,
    db: Session
) -> FinalInterviewReadiness:

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return FinalInterviewReadiness(
            eligible=False,
            readiness_score=0.0,
            competencies_to_assess=[],
            message="User not found."
        )

    competencies = db.query(Competency).all()

    user_competencies = {
        uc.competency_id: uc
        for uc in db.query(UserCompetency)
        .filter(UserCompetency.user_id == user_id)
        .all()
    }

    quiz_count = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user_id)
        .count()
    )

    competency_cards = []
    total_score = 0.0

    for competency in competencies:

        user_comp = user_competencies.get(competency.id)

        current_score = (
            user_comp.current_level
            if user_comp
            else 0.0
        )

        gap = max(
            0.0,
            competency.required_level - current_score
        )

        total_score += current_score

        competency_cards.append(
            FinalInterviewCompetency(
                competency_id=competency.id,
                code=competency.code,
                name=competency.name,
                domain=competency.domain,
                current_score=round(current_score, 1),
                required_benchmark=round(
                    competency.required_level, 1
                ),
                gap=round(gap, 1)
            )
        )

    readiness_score = (
        round(total_score / len(competencies), 1)
        if competencies
        else 0.0
    )

    # Phase 3B:
    # The final AI interview is currently available
    # for authenticated users so the complete interview
    # experience can be tested end-to-end.
    eligible = True

    message = (
        "You are ready for your final AI interview."
    )

    # Prioritize competencies with the largest gaps.
    competency_cards.sort(
        key=lambda item: item.gap,
        reverse=True
    )

    return FinalInterviewReadiness(
        eligible=eligible,
        readiness_score=readiness_score,
        competencies_to_assess=competency_cards,
        message=message
    )
async def generate_interview_questions(
    user_id: int,
    db: Session,
    num_questions: int = 5
):
    readiness = get_final_interview_readiness(
        user_id,
        db
    )

    if not readiness.eligible:
        return {
            "eligible": False,
            "questions": [],
            "message": readiness.message
        }

    competencies = [
        competency.model_dump()
        for competency in readiness.competencies_to_assess
    ]

    questions = await generate_final_interview_questions(
        competencies=competencies,
        num_questions=num_questions
    )

    return {
        "eligible": True,
        "readiness_score": readiness.readiness_score,
        "questions": questions,
        "message": "Final AI interview questions generated successfully."
    }