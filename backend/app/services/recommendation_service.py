from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..models.models import (
    User,
    Competency,
    LearningResource,
    ResourceCompetencyMapping,
    UserCompetency,
    QuizAttempt
)
from ..schemas.resource import (
    LearningResourceOut,
    RecommendationItem,
    RecommendationResponse,
    LearningPathMilestone,
    LearningPathResponse
)
from .competency_service import analyze_competency_gaps, get_user_competency_profile

def get_personalized_recommendations(user_id: int, db: Session) -> RecommendationResponse:
    user = db.query(User).filter(User.id == user_id).first()
    gap_analysis = analyze_competency_gaps(user_id, db)
    all_resources = db.query(LearningResource).filter(LearningResource.is_active == True).all()

    if gap_analysis.gaps and gap_analysis.gaps[0].gap > 0:
        top_gap = gap_analysis.gaps[0]
        focus_gap_name = top_gap.name
        focus_gap_code = top_gap.code
        gap_val = top_gap.gap
    else:
        focus_gap_name = "Survey Methodology & Sampling Design"
        focus_gap_code = "STAT_SURVEY"
        gap_val = 0.0

    recommendations: List[RecommendationItem] = []

    for res in all_resources:
        # Check mapped competencies
        aligned_codes = [m.competency.code for m in res.competency_mappings if m.competency]
        is_direct_match = focus_gap_code in aligned_codes or focus_gap_code in res.title.upper()

        if is_direct_match:
            match_score = 95.0
            reason = f"Directly targets your critical competency gap in {focus_gap_name} ({gap_val}% gap for {user.department if user else 'your division'})."
        elif any(g.code in aligned_codes for g in gap_analysis.gaps[:3]):
            matched_secondary = next((g for g in gap_analysis.gaps[:3] if g.code in aligned_codes), None)
            match_score = 82.0
            reason = f"Targets secondary competency gap in {matched_secondary.name if matched_secondary else 'core statistics'} ({matched_secondary.gap if matched_secondary else 0}% gap)."
        else:
            match_score = 65.0
            reason = f"Core statistical capacity building resource recommended for {user.designation if user else 'officer cadre'}."

        res_out = LearningResourceOut(
            id=res.id,
            title=res.title,
            description=res.description,
            source=res.source,
            official_url=res.official_url,
            resource_type=res.resource_type,
            difficulty=res.difficulty,
            estimated_duration_mins=res.estimated_duration_mins,
            thumbnail_url=res.thumbnail_url,
            aligned_competencies=aligned_codes
        )

        recommendations.append(
            RecommendationItem(
                resource=res_out,
                matched_competency_code=focus_gap_code,
                matched_competency_name=focus_gap_name,
                competency_gap=gap_val,
                relevance_reason=reason,
                match_score=match_score
            )
        )

    # Sort by match score descending
    recommendations.sort(key=lambda x: x.match_score, reverse=True)

    curation_note = (
        f"AI Curated Roadmap for {user.full_name if user else 'Officer'} ({user.department if user else 'MoSPI'}): "
        f"Prioritizing your primary competency gap in {focus_gap_name} ({gap_val}% gap). "
        f"Begin with foundational NSSTA Academy modules to build conceptual mastery, followed by official MoSPI laboratory manuals and eSankhyiki data products. "
        f"Validate each milestone with AI Learning Studio practice quizzes."
    )

    return RecommendationResponse(
        primary_focus_gap=focus_gap_name,
        gap_percentage=gap_val,
        total_recommendations=len(recommendations),
        recommendations=recommendations[:8],
        ai_curation_note=curation_note
    )

def get_personalized_learning_path(user_id: int, db: Session) -> LearningPathResponse:
    user = db.query(User).filter(User.id == user_id).first()
    gap_analysis = analyze_competency_gaps(user_id, db)
    profile = get_user_competency_profile(user_id, db)
    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user_id).all()

    top_gap = gap_analysis.gaps[0] if gap_analysis.gaps and gap_analysis.gaps[0].gap > 0 else None
    top_gap_name = top_gap.name if top_gap else "Survey Methodology & Sampling Design"
    top_gap_code = top_gap.code if top_gap else "STAT_SURVEY"

    # Match resources to the gap
    all_resources = db.query(LearningResource).filter(LearningResource.is_active == True).all()
    matched_courses = []
    matched_labs = []
    matched_reports = []

    for r in all_resources:
        aligned = [m.competency.code for m in r.competency_mappings if m.competency]
        if top_gap_code in aligned or any(g.code in aligned for g in gap_analysis.gaps[:2]):
            if r.source == "NSSTA":
                matched_courses.append(r)
            elif r.source == "MoSPI":
                matched_labs.append(r)
            else:
                matched_reports.append(r)

    primary_course = matched_courses[0] if matched_courses else (all_resources[0] if all_resources else None)
    primary_lab = matched_labs[0] if matched_labs else (all_resources[1] if len(all_resources) > 1 else None)
    primary_pub = matched_reports[0] if matched_reports else (all_resources[2] if len(all_resources) > 2 else None)

    # Determine real-time milestone completions
    has_assessed = len(user_comps) > 0 and any(uc.current_level > 0 for uc in user_comps)
    has_gaps_reviewed = has_assessed
    has_taken_quiz = len(attempts) > 0
    has_gained_competency = any(a.competency_delta > 0 for a in attempts)
    interview_ready = profile.overall_readiness_score >= 70.0

    milestones: List[LearningPathMilestone] = [
        LearningPathMilestone(
            phase_number=1,
            title="Step 1: Baseline Diagnostic Assessment",
            domain="Calibration",
            description=f"Complete the calibrated diagnostic test to establish initial benchmark levels across all 9 statistical disciplines tailored for {user.department if user else 'your division'}.",
            recommended_resource="Official Diagnostic Assessment",
            official_url="/assessment",
            estimated_hours=0.5,
            action_type="assessment",
            action_link="/assessment",
            completed=has_assessed,
            competency_code="ALL"
        ),
        LearningPathMilestone(
            phase_number=2,
            title="Step 2: Deterministic Gap Analysis & AI Prescription",
            domain="Diagnostics",
            description=f"Inspect your priority-ranked gaps ($Required - Current = Gap$) and review the AI capacity building prescription for {user.designation if user else 'your cadre'}.",
            recommended_resource="Deterministic Gap Matrix & AI Prescription",
            official_url="/gap-analysis",
            estimated_hours=0.5,
            action_type="assessment",
            action_link="/gap-analysis",
            completed=has_gaps_reviewed,
            competency_code=top_gap_code
        ),
        LearningPathMilestone(
            phase_number=3,
            title=f"Step 3: NSSTA Academy Module — {primary_course.title if primary_course else 'Official Statistical Foundations'}",
            domain="Foundations",
            description=f"Complete the recommended training module at NSSTA to build conceptual mastery in {top_gap_name}.",
            recommended_resource=primary_course.title if primary_course else "NSSTA Official Statistics Module",
            resource_id=primary_course.id if primary_course else None,
            official_url=primary_course.official_url if primary_course else "https://www.mospi.gov.in",
            estimated_hours=3.0,
            action_type="course",
            action_link="/hub?tab=nssta",
            completed=has_taken_quiz,
            competency_code=top_gap_code
        ),
        LearningPathMilestone(
            phase_number=4,
            title=f"Step 4: NSSTA Lab Manual & MoSPI Publication — {primary_lab.title if primary_lab else 'Advanced Statistics Manual'}",
            domain="Applied Skills",
            description=f"Review laboratory manual and MoSPI survey methodology notes for hands-on application in {top_gap_name}.",
            recommended_resource=primary_lab.title if primary_lab else "NSSTA Training Manual",
            resource_id=primary_lab.id if primary_lab else None,
            official_url=primary_lab.official_url if primary_lab else "https://nssta.gov.in",
            estimated_hours=2.5,
            action_type="lab",
            action_link="/hub?tab=nssta",
            completed=has_taken_quiz,
            competency_code=top_gap_code
        ),
        LearningPathMilestone(
            phase_number=5,
            title=f"Step 5: AI Learning Studio Document & Practice Quiz",
            domain="AI Assessment",
            description=f"Generate schema-enforced verification quizzes in the AI Learning Studio from study materials on {top_gap_name}.",
            recommended_resource="AI MCQ Generation & Pedagogical Explanations",
            official_url="/studio",
            estimated_hours=1.0,
            action_type="quiz",
            action_link=f"/studio?topic={top_gap_name}",
            completed=has_taken_quiz,
            competency_code=top_gap_code
        ),
        LearningPathMilestone(
            phase_number=6,
            title="Step 6: Verified Competency Delta Calibration (+Delta Gain)",
            domain="Outcome & Recalibration",
            description="Score >= 75% on generated quizzes to trigger the closed-loop delta update and record demonstrable skill growth (+26%).",
            recommended_resource="Competency Progress Analytics & Growth Delta",
            official_url="/progress",
            estimated_hours=0.5,
            action_type="quiz",
            action_link="/progress",
            completed=has_gained_competency,
            competency_code=top_gap_code
        ),
        LearningPathMilestone(
            phase_number=7,
            title="Step 7: AI Final Interview",
            domain="Capstone Assessment",
            description="Demonstrate comprehensive competency mastery across India's Official Statistical System in an AI-powered conversational interview.",
            recommended_resource="AI Final Interview Readiness & Multi-Domain Evaluation",
            official_url="/final-interview",
            estimated_hours=1.0,
            action_type="interview",
            action_link="/final-interview",
            completed=interview_ready and has_gained_competency,
            competency_code="ALL"
        )
    ]

    completed_count = sum(1 for m in milestones if m.completed)
    progress_pct = int(round((completed_count / len(milestones)) * 100))

    curation_note = (
        f"Grok AI Personalized Learning Roadmap for {user.full_name if user else 'Officer'} ({user.designation if user else 'Cadre'}, {user.department if user else 'MoSPI'}): "
        f"This 7-step progression is synchronized with your role-specific benchmarks. "
        f"Current focus: Bridge the {top_gap.gap if top_gap else 0}% gap in {top_gap_name} to elevate your overall readiness score to {profile.overall_readiness_score}%."
    )

    return LearningPathResponse(
        user_id=user.id if user else 0,
        officer_name=user.full_name if user else "Officer",
        designation=user.designation if user else "Statistical Officer",
        division=user.department if user else "MoSPI",
        overall_readiness_score=profile.overall_readiness_score,
        primary_focus_gap=top_gap_name,
        total_milestones=len(milestones),
        completed_milestones=completed_count,
        progress_percentage=progress_pct,
        milestones=milestones,
        ai_curation_note=curation_note
    )
