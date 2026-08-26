from sqlalchemy.orm import Session
from typing import List
from ..models.models import User, Competency, LearningResource, ResourceCompetencyMapping
from ..schemas.resource import LearningResourceOut, RecommendationItem, RecommendationResponse
from .competency_service import analyze_competency_gaps

def get_personalized_recommendations(user_id: int, db: Session) -> RecommendationResponse:
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
            reason = f"Directly targets your critical competency gap in {focus_gap_name} ({gap_val}% gap)."
        elif any(g.code in aligned_codes for g in gap_analysis.gaps[:3]):
            match_score = 80.0
            reason = f"Supports secondary competency gaps identified in your statistical profile."
        else:
            match_score = 65.0
            reason = f"Core capacity building resource recommended for official statistical officers."

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
        f"Recommended learning sequence tailored for your current gap in {focus_gap_name}. "
        f"We suggest starting with the iGOT Karmayogi module for conceptual foundation, "
        f"followed by the official NSSTA laboratory guides and MoSPI survey reports."
    )

    return RecommendationResponse(
        primary_focus_gap=focus_gap_name,
        gap_percentage=gap_val,
        total_recommendations=len(recommendations),
        recommendations=recommendations[:8],
        ai_curation_note=curation_note
    )
