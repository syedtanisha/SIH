from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..models.models import Quiz, QuizQuestion, User
from ..schemas.quiz import (
    QuizGenerateRequest,
    QuizOut,
    QuizQuestionOut,
    QuizSubmitRequest,
    QuizAttemptResultOut
)
from ..core.security import get_current_user
from ..services.quiz_generator_service import create_ai_quiz, evaluate_quiz_submission

router = APIRouter(prefix="/quizzes", tags=["AI Quizzes"])

@router.post("/generate", response_model=QuizOut, status_code=status.HTTP_201_CREATED)
async def generate_quiz(
    request: QuizGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await create_ai_quiz(request, current_user.id, db)

@router.get("", response_model=List[QuizOut])
def list_my_quizzes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quizzes = db.query(Quiz).filter(Quiz.user_id == current_user.id).order_by(Quiz.created_at.desc()).all()
    results = []
    for q in quizzes:
        questions_out = [
            QuizQuestionOut(
                id=quest.id,
                question_text=quest.question_text,
                option_a=quest.option_a,
                option_b=quest.option_b,
                option_c=quest.option_c,
                option_d=quest.option_d,
                difficulty=quest.difficulty
            )
            for quest in q.questions
        ]
        results.append(
            QuizOut(
                id=q.id,
                title=q.title,
                topic=q.topic,
                difficulty=q.difficulty,
                total_questions=q.total_questions,
                time_limit_mins=q.time_limit_mins,
                created_at=q.created_at,
                questions=questions_out
            )
        )
    return results

@router.get("/{quiz_id}", response_model=QuizOut)
def get_quiz(
    quiz_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")
    
    # Enforce quiz ownership authorization
    if q.user_id != current_user.id and getattr(current_user, "role", "user") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You do not own this quiz."
        )
    
    questions_out = [
        QuizQuestionOut(
            id=quest.id,
            question_text=quest.question_text,
            option_a=quest.option_a,
            option_b=quest.option_b,
            option_c=quest.option_c,
            option_d=quest.option_d,
            difficulty=quest.difficulty
        )
        for quest in q.questions
    ]
    return QuizOut(
        id=q.id,
        title=q.title,
        topic=q.topic,
        difficulty=q.difficulty,
        total_questions=q.total_questions,
        time_limit_mins=q.time_limit_mins,
        created_at=q.created_at,
        questions=questions_out
    )

@router.post("/{quiz_id}/submit", response_model=QuizAttemptResultOut)
async def submit_quiz(
    quiz_id: int,
    submission: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")
    
    # Enforce quiz ownership authorization
    if q.user_id != current_user.id and getattr(current_user, "role", "user") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You cannot submit answers to another officer's quiz."
        )

    return await evaluate_quiz_submission(quiz_id, current_user.id, submission, db)
