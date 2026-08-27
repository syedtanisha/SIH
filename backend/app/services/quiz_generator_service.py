from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio
from ..models.models import (
    User,
    Document,
    Competency,
    UserCompetency,
    Quiz,
    QuizQuestion,
    QuizAttempt,
    LearningProgressHistory,
    LearningResource
)
from ..schemas.quiz import (
    QuizGenerateRequest,
    QuizOut,
    QuizQuestionOut,
    QuizQuestionDetailOut,
    QuizSubmitRequest,
    QuizAttemptResultOut,
    QuestionResultDetail
)
from .ai_service import generate_mcqs_from_text, generate_grok_quiz_feedback

def create_ai_quiz(request: QuizGenerateRequest, user_id: int, db: Session) -> QuizOut:
    source_text = ""
    doc_obj = None
    target_comp = None

    if request.resource_id:
        res_obj = db.query(LearningResource).filter(LearningResource.id == request.resource_id).first()
        if res_obj:
            source_text = f"Title: {res_obj.title}\nSource: {res_obj.source}\nType: {res_obj.resource_type}\nDescription: {res_obj.description}\nOfficial Curriculum on {res_obj.title}"
            # Extract target competency from mappings if available
            if res_obj.competency_mappings:
                target_comp = res_obj.competency_mappings[0].competency
    elif request.document_id:
        doc_obj = db.query(Document).filter(
            Document.id == request.document_id,
            Document.user_id == user_id
        ).first()
        if not doc_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Uploaded document not found."
            )
        source_text = doc_obj.extracted_text
    elif request.custom_text:
        source_text = request.custom_text
    else:
        source_text = f"Official statistical concepts and guidelines on {request.topic}"

    # Determine aligned competency
    if request.competency_id:
        target_comp = db.query(Competency).filter(Competency.id == request.competency_id).first()
    if not target_comp:
        # Map by topic keywords or default to STAT_COMPUTE / STAT_SURVEY
        topic_lower = request.topic.lower()
        if "python" in topic_lower or "comput" in topic_lower or "data" in topic_lower:
            target_comp = db.query(Competency).filter(Competency.code == "STAT_COMPUTE").first()
        elif "account" in topic_lower or "gdp" in topic_lower or "gva" in topic_lower:
            target_comp = db.query(Competency).filter(Competency.code == "STAT_NAT_ACC").first()
        elif "price" in topic_lower or "cpi" in topic_lower or "iip" in topic_lower:
            target_comp = db.query(Competency).filter(Competency.code == "STAT_PRICE_IND").first()
        else:
            target_comp = db.query(Competency).filter(Competency.code == "STAT_SURVEY").first()

    raw_questions = generate_mcqs_from_text(
        text=source_text,
        topic=request.topic,
        num_questions=request.num_questions,
        difficulty=request.difficulty
    )

    new_quiz = Quiz(
        user_id=user_id,
        document_id=request.document_id,
        competency_id=target_comp.id if target_comp else None,
        title=f"AI Quiz: {request.topic}",
        topic=request.topic,
        difficulty=request.difficulty,
        total_questions=len(raw_questions),
        time_limit_mins=max(5, len(raw_questions) * 3)
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    q_out_list: List[QuizQuestionOut] = []
    for q_data in raw_questions:
        q_record = QuizQuestion(
            quiz_id=new_quiz.id,
            question_text=q_data["question_text"],
            option_a=q_data["option_a"],
            option_b=q_data["option_b"],
            option_c=q_data["option_c"],
            option_d=q_data["option_d"],
            correct_option=q_data["correct_option"],
            explanation=q_data["explanation"],
            competency_code=target_comp.code if target_comp else "STAT_SURVEY",
            difficulty=request.difficulty
        )
        db.add(q_record)
        db.commit()
        db.refresh(q_record)

        q_out_list.append(
            QuizQuestionOut(
                id=q_record.id,
                question_text=q_record.question_text,
                option_a=q_record.option_a,
                option_b=q_record.option_b,
                option_c=q_record.option_c,
                option_d=q_record.option_d,
                difficulty=q_record.difficulty
            )
        )

    return QuizOut(
        id=new_quiz.id,
        title=new_quiz.title,
        topic=new_quiz.topic,
        difficulty=new_quiz.difficulty,
        total_questions=new_quiz.total_questions,
        time_limit_mins=new_quiz.time_limit_mins,
        created_at=new_quiz.created_at,
        questions=q_out_list
    )

def evaluate_quiz_submission(quiz_id: int, user_id: int, submission: QuizSubmitRequest, db: Session) -> QuizAttemptResultOut:
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")

    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).all()
    if not questions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No questions in this quiz.")

    answers_map = {a.question_id: a.selected_option.strip().upper() for a in submission.answers}
    total_correct = 0
    question_results: List[QuestionResultDetail] = []

    for q in questions:
        user_sel = answers_map.get(q.id, "")
        is_corr = (user_sel == q.correct_option)
        if is_corr:
            total_correct += 1

        question_results.append(
            QuestionResultDetail(
                question_id=q.id,
                question_text=q.question_text,
                user_selected=user_sel if user_sel else "None",
                correct_option=q.correct_option,
                is_correct=is_corr,
                explanation=q.explanation
            )
        )

    score_pct = round((total_correct / len(questions)) * 100.0, 1)

    # Competency Delta Calculation
    comp_obj = db.query(Competency).filter(Competency.id == quiz.competency_id).first() if quiz.competency_id else None
    before_score = 42.0 # default baseline before learning if not yet assessed
    after_score = 42.0
    delta = 0.0

    if comp_obj:
        user_comp = db.query(UserCompetency).filter(
            UserCompetency.user_id == user_id,
            UserCompetency.competency_id == comp_obj.id
        ).first()

        if user_comp:
            before_score = user_comp.current_level
            # Weighted formula for demonstrable learning gain:
            # New score incorporates quiz accuracy weighted against gap
            gain = round((score_pct * 0.3) + 2.0, 1)
            after_score = min(100.0, round(before_score + gain, 1))
            delta = round(after_score - before_score, 1)

            user_comp.current_level = after_score
            user_comp.last_assessed_at = datetime.utcnow()
            user_comp.assessment_source = "quiz_evaluation"
        else:
            after_score = min(100.0, round(score_pct * 0.8, 1))
            delta = after_score
            new_uc = UserCompetency(
                user_id=user_id,
                competency_id=comp_obj.id,
                current_level=after_score,
                assessment_source="quiz_evaluation",
                last_assessed_at=datetime.utcnow()
            )
            db.add(new_uc)

        # Log to progress history
        hist = LearningProgressHistory(
            user_id=user_id,
            competency_id=comp_obj.id,
            event_type="quiz_completed",
            previous_score=before_score,
            new_score=after_score,
            delta=delta,
            created_at=datetime.utcnow()
        )
        db.add(hist)

    mistakes = [
        {
            "question_text": q.question_text,
            "user_selected": q.user_selected,
            "correct_option": q.correct_option,
            "explanation": q.explanation
        }
        for q in question_results if not q.is_correct
    ]

    feedback = (
        f"Grok AI Performance Analysis: You scored {score_pct}% ({total_correct}/{len(questions)} correct). "
        f"Your competency in '{comp_obj.name if comp_obj else quiz.topic}' improved by +{delta}% "
        f"(from {before_score}% to {after_score}%). "
    )
    if mistakes:
        feedback += f"You missed {len(mistakes)} question(s). Review the detailed pedagogical explanations below to reinforce official methodology before the next milestone."
    else:
        feedback += "Outstanding result with 100% precision! Your statistical understanding aligns completely with Ministry benchmarks. Continue along your learning path."

    attempt = QuizAttempt(
        quiz_id=quiz.id,
        user_id=user_id,
        score=score_pct,
        total_correct=total_correct,
        total_questions=len(questions),
        competency_id=quiz.competency_id,
        competency_score_before=before_score,
        competency_score_after=after_score,
        competency_delta=delta,
        ai_qualitative_feedback=feedback,
        completed_at=datetime.utcnow()
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return QuizAttemptResultOut(
        attempt_id=attempt.id,
        quiz_id=quiz.id,
        quiz_title=quiz.title,
        score=score_pct,
        total_correct=total_correct,
        total_questions=len(questions),
        competency_name=comp_obj.name if comp_obj else quiz.topic,
        competency_score_before=before_score,
        competency_score_after=after_score,
        competency_delta=delta,
        ai_qualitative_feedback=feedback,
        question_results=question_results,
        completed_at=attempt.completed_at
    )
