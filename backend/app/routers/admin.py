from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.models import User, Competency, UserCompetency, QuizAttempt, LearningResource
from ..core.security import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin & System Analytics"])

@router.get("/stats")
def get_admin_system_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_competencies = db.query(Competency).count()
    total_resources = db.query(LearningResource).count()
    total_quiz_attempts = db.query(QuizAttempt).count()
    
    all_user_comps = db.query(UserCompetency).all()
    avg_readiness = round(sum(uc.current_level for uc in all_user_comps) / len(all_user_comps), 1) if all_user_comps else 0.0

    return {
        "total_officers_registered": total_users,
        "total_statistical_competencies": total_competencies,
        "total_learning_resources": total_resources,
        "total_quizzes_evaluated": total_quiz_attempts,
        "system_average_readiness_score": avg_readiness,
        "status": "Operational",
        "cadres_represented": ["Indian Statistical Service (ISS)", "Subordinate Statistical Service (SSS)", "State DES", "MoSPI Field Operations"]
    }
