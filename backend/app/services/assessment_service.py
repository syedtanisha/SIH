from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
from ..models.models import User, Competency, UserCompetency, LearningProgressHistory
from ..schemas.assessment import (
    BaselineAssessmentOut,
    BaselineQuestion,
    BaselineQuestionOption,
    BaselineAssessmentSubmit,
    BaselineAssessmentResultOut
)
from ..data.seed_data import BASELINE_QUESTIONS

def get_baseline_assessment_data(user: User = None) -> BaselineAssessmentOut:
    questions_out: List[BaselineQuestion] = []
    
    # Sort or prioritize questions based on user's core competencies if available
    core_codes = []
    div_title = "Official Statistical System"
    if user:
        from .competency_service import resolve_role_benchmarks
        role_meta = resolve_role_benchmarks(user.department, user.designation)
        core_codes = role_meta.get("core_competencies", [])
        div_title = user.department or "MoSPI"

    sorted_q_list = sorted(
        BASELINE_QUESTIONS,
        key=lambda q: (0 if q["competency_code"] in core_codes else 1, q["id"])
    )

    for q in sorted_q_list:
        options = [BaselineQuestionOption(key=opt["key"], text=opt["text"]) for opt in q["options"]]
        questions_out.append(
            BaselineQuestion(
                id=q["id"],
                competency_code=q["competency_code"],
                competency_name=q["competency_name"],
                domain=q["domain"],
                question_text=q["question_text"],
                options=options,
                difficulty=q["difficulty"]
            )
        )

    return BaselineAssessmentOut(
        assessment_id="mospi-baseline-diagnostic-v1",
        title=f"Baseline Diagnostic Assessment ({div_title})",
        instructions=f"Complete this calibrated diagnostic evaluation to calibrate your initial competency baseline against official {div_title} benchmarks across core statistical disciplines.",
        total_questions=len(questions_out),
        time_limit_mins=20,
        questions=questions_out
    )

def evaluate_baseline_submission(user_id: int, submission: BaselineAssessmentSubmit, db: Session) -> BaselineAssessmentResultOut:
    answers_map = {a.question_id: a.selected_option.strip().upper() for a in submission.answers}
    question_dict = {q["id"]: q for q in BASELINE_QUESTIONS}

    total_correct = 0
    total_questions = len(BASELINE_QUESTIONS)
    domain_correct = {}
    domain_totals = {}
    competency_scores = {}

    for q in BASELINE_QUESTIONS:
        qid = q["id"]
        domain = q["domain"]
        comp_code = q["competency_code"]
        correct_ans = q.get("correct_option", "A")

        domain_totals[domain] = domain_totals.get(domain, 0) + 1
        user_ans = answers_map.get(qid, "")

        is_correct = (user_ans == correct_ans)
        if is_correct:
            total_correct += 1
            domain_correct[domain] = domain_correct.get(domain, 0) + 1
            competency_scores[comp_code] = 75.0 # baseline score for answering correctly
        else:
            competency_scores[comp_code] = 40.0 # baseline score if answered incorrectly

    overall_score = round((total_correct / total_questions) * 100.0, 1) if total_questions > 0 else 0.0

    domain_scores = {}
    for d, tot in domain_totals.items():
        corr = domain_correct.get(d, 0)
        domain_scores[d] = round((corr / tot) * 100.0, 1)

    # Update or insert user competencies in DB
    all_competencies = db.query(Competency).all()
    comp_code_map = {c.code: c for c in all_competencies}

    for code, score in competency_scores.items():
        comp_obj = comp_code_map.get(code)
        if comp_obj:
            uc = db.query(UserCompetency).filter(
                UserCompetency.user_id == user_id,
                UserCompetency.competency_id == comp_obj.id
            ).first()
            if not uc:
                uc = UserCompetency(
                    user_id=user_id,
                    competency_id=comp_obj.id,
                    current_level=score,
                    assessment_source="baseline_assessment",
                    last_assessed_at=datetime.utcnow()
                )
                db.add(uc)
            else:
                prev = uc.current_level
                uc.current_level = score
                uc.assessment_source = "baseline_assessment"
                uc.last_assessed_at = datetime.utcnow()

            # Record in progress history
            hist = LearningProgressHistory(
                user_id=user_id,
                competency_id=comp_obj.id,
                event_type="baseline_assessment",
                previous_score=0.0,
                new_score=score,
                delta=score,
                created_at=datetime.utcnow()
            )
            db.add(hist)

    db.commit()

    feedback = (
        f"Baseline assessment completed! You achieved an overall score of {overall_score}%. "
        f"Your statistical competencies have been mapped against official MoSPI benchmarks. "
        f"Explore your prioritized competency gap analysis to begin targeted learning."
    )

    return BaselineAssessmentResultOut(
        overall_score=overall_score,
        total_correct=total_correct,
        total_questions=total_questions,
        domain_scores=domain_scores,
        competency_scores=competency_scores,
        initialized_competencies_count=len(competency_scores),
        feedback_summary=feedback
    )
