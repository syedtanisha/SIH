from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..models.models import User, Competency, UserCompetency
from ..schemas.competency import (
    UserCompetencyDetail,
    CompetencyProfileOut,
    CompetencyGapItem,
    CompetencyGapAnalysisOut,
)
from .ai_service import generate_gap_diagnosis

def calculate_gap(required: float, current: float) -> float:
    return max(0.0, round(required - current, 2))

def get_priority_label(gap: float) -> str:
    if gap >= 30.0:
        return "High"
    elif gap >= 15.0:
        return "Medium"
    elif gap > 0.0:
        return "Low"
    else:
        return "Met"

def get_user_competency_profile(user_id: int, db: Session) -> CompetencyProfileOut:
    user = db.query(User).filter(User.id == user_id).first()
    all_competencies = db.query(Competency).all()
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user_id).all()
    user_comp_map = {uc.competency_id: uc for uc in user_comps}

    details: List[UserCompetencyDetail] = []
    total_score = 0.0
    met_count = 0
    gaps_count = 0

    for comp in all_competencies:
        uc = user_comp_map.get(comp.id)
        current = uc.current_level if uc else 0.0
        gap = calculate_gap(comp.required_level, current)
        priority = get_priority_label(gap)

        if gap == 0.0 and current >= comp.required_level:
            met_count += 1
        else:
            gaps_count += 1

        total_score += current
        details.append(
            UserCompetencyDetail(
                competency_id=comp.id,
                code=comp.code,
                name=comp.name,
                domain=comp.domain,
                description=comp.description,
                required_level=comp.required_level,
                current_level=current,
                gap=gap,
                priority=priority,
                last_assessed_at=uc.last_assessed_at if uc else None
            )
        )

    overall_readiness = round(total_score / len(all_competencies), 1) if all_competencies else 0.0

    return CompetencyProfileOut(
        overall_readiness_score=overall_readiness,
        total_competencies=len(all_competencies),
        competencies_met_count=met_count,
        active_gaps_count=gaps_count,
        competencies=details
    )

def analyze_competency_gaps(user_id: int, db: Session) -> CompetencyGapAnalysisOut:
    profile = get_user_competency_profile(user_id, db)
    user = db.query(User).filter(User.id == user_id).first()
    comp_records = {c.id: c for c in db.query(Competency).all()}

    gap_items: List[CompetencyGapItem] = []
    domain_gap_counts: Dict[str, float] = {}

    for item in profile.competencies:
        comp_obj = comp_records.get(item.competency_id)
        weight = comp_obj.weight if comp_obj else 1.0
        priority_score = round(item.gap * weight, 2)

        focus_action = f"Complete recommended iGOT courses & MoSPI study material on {item.name}"
        if item.priority == "High":
            focus_action = f"Immediate priority: Study foundational methodology for {item.name} and take verification quizzes."
        elif item.priority == "Met":
            focus_action = "Benchmark achieved. Continue periodic refresher assessments."

        gap_items.append(
            CompetencyGapItem(
                competency_id=item.competency_id,
                code=item.code,
                name=item.name,
                domain=item.domain,
                current_level=item.current_level,
                required_level=item.required_level,
                gap=item.gap,
                priority=item.priority,
                priority_score=priority_score,
                recommended_focus_action=focus_action
            )
        )

        domain_gap_counts[item.domain] = domain_gap_counts.get(item.domain, 0.0) + item.gap

    # Sort gaps by priority score descending
    gap_items.sort(key=lambda x: x.priority_score, reverse=True)

    critical_count = sum(1 for g in gap_items if g.priority == "High")
    primary_domain = max(domain_gap_counts.items(), key=lambda x: x[1])[0] if domain_gap_counts else "Survey Operations"

    # AI diagnosis explanation
    ai_summary = generate_gap_diagnosis(
        officer_name=user.full_name if user else "Officer",
        designation=user.designation if user else "Statistical Officer",
        gaps=[g.dict() for g in gap_items if g.gap > 0],
        overall_readiness=profile.overall_readiness_score
    )

    return CompetencyGapAnalysisOut(
        total_gaps_identified=profile.active_gaps_count,
        critical_gaps_count=critical_count,
        primary_focus_domain=primary_domain,
        gaps=gap_items,
        ai_diagnosis_summary=ai_summary
    )
