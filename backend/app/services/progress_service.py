from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..models.models import User, Competency, UserCompetency, QuizAttempt, LearningProgressHistory
from ..schemas.progress import ProgressSummaryOut, ProgressEventOut, CompetencyProgressCard

def get_user_progress_summary(user_id: int, db: Session) -> ProgressSummaryOut:
    user = db.query(User).filter(User.id == user_id).first()
    all_competencies = db.query(Competency).all()
    user_comps = {uc.competency_id: uc for uc in db.query(UserCompetency).filter(UserCompetency.user_id == user_id).all()}

    history_records = db.query(LearningProgressHistory).filter(
        LearningProgressHistory.user_id == user_id
    ).order_by(LearningProgressHistory.created_at.desc()).all()

    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()

    cards: List[CompetencyProgressCard] = []
    total_gain_sum = 0.0
    total_score = 0.0

    for comp in all_competencies:
        uc = user_comps.get(comp.id)
        current = uc.current_level if uc else 0.0
        total_score += current

        # Calculate initial score from first history entry or default to 40.0
        comp_hist = [h for h in history_records if h.competency_id == comp.id]
        if comp_hist:
            initial = comp_hist[-1].previous_score
            gain = max(0.0, round(current - initial, 1))
        else:
            initial = current
            gain = 0.0

        total_gain_sum += gain

        if current >= comp.required_level:
            status = "Mastered"
        elif gain > 0:
            status = "Improving"
        else:
            status = "Needs Attention"

        cards.append(
            CompetencyProgressCard(
                competency_id=comp.id,
                code=comp.code,
                name=comp.name,
                domain=comp.domain,
                initial_score=initial,
                current_score=current,
                required_benchmark=comp.required_level,
                total_gain=gain,
                status=status
            )
        )

    overall_readiness = round(total_score / len(all_competencies), 1) if all_competencies else 0.0
    avg_quiz_score = round(sum(a.score for a in attempts) / len(attempts), 1) if attempts else 0.0

    recent_events_out: List[ProgressEventOut] = []
    for h in history_records[:10]:
        comp_name = "General Statistics"
        comp_domain = "Official Statistics"
        comp_obj = db.query(Competency).filter(Competency.id == h.competency_id).first()
        if comp_obj:
            comp_name = comp_obj.name
            comp_domain = comp_obj.domain

        recent_events_out.append(
            ProgressEventOut(
                id=h.id,
                competency_id=h.competency_id,
                competency_name=comp_name,
                domain=comp_domain,
                event_type=h.event_type,
                previous_score=h.previous_score,
                new_score=h.new_score,
                delta=h.delta,
                created_at=h.created_at
            )
        )

    return ProgressSummaryOut(
        user_id=user.id if user else 0,
        user_name=user.full_name if user else "Officer",
        designation=user.designation if user else "Statistical Officer",
        department=user.department if user else "MoSPI",
        overall_readiness_score=overall_readiness,
        total_learning_gain=round(total_gain_sum / len(all_competencies), 1) if all_competencies else 0.0,
        quizzes_completed=len(attempts),
        average_quiz_score=avg_quiz_score,
        competency_breakdown=cards,
        recent_events=recent_events_out
    )
