from sqlalchemy.orm import Session
from typing import List, Dict, Any, Tuple
from ..models.models import User, Competency, UserCompetency
from ..schemas.competency import (
    UserCompetencyDetail,
    CompetencyProfileOut,
    CompetencyGapItem,
    CompetencyGapAnalysisOut,
)
from ..data.seed_data import DIVISION_PROFILES, DESIGNATION_MODIFIERS
from .ai_service import generate_gap_diagnosis

def resolve_role_benchmarks(department: str = "", designation: str = "") -> Dict[str, Any]:
    """Resolve role-specific competency benchmarks, weights, and core disciplines based on Division and Designation dataset."""
    dept_str = (department or "").lower()
    desig_str = (designation or "").lower()

    # 1. Match Division Profile
    selected_div_key = None
    for key in DIVISION_PROFILES:
        if "nad" in dept_str or "national accounts" in dept_str:
            if "national accounts" in key.lower():
                selected_div_key = key
                break
        elif "fod" in dept_str or "field operations" in dept_str:
            if "field operations" in key.lower():
                selected_div_key = key
                break
        elif "esd" in dept_str or "economic statistics" in dept_str:
            if "economic statistics" in key.lower():
                selected_div_key = key
                break
        elif "sdrd" in dept_str or "survey design" in dept_str:
            if "survey design" in key.lower():
                selected_div_key = key
                break
        elif "dqdd" in dept_str or "data quality" in dept_str or "dissemination" in dept_str:
            if "data quality" in key.lower():
                selected_div_key = key
                break
        elif "des" in dept_str or "state" in dept_str:
            if "state des" in key.lower():
                selected_div_key = key
                break
        elif "niti" in dept_str or "ministry" in dept_str or "line" in dept_str:
            if "ministry line" in key.lower():
                selected_div_key = key
                break

    if not selected_div_key:
        # Default division profile
        div_profile = {
            "division_code": "GENERAL",
            "description": "General Statistical Professional Cadre",
            "core_competencies": ["STAT_SURVEY", "STAT_COMPUTE", "STAT_NAT_ACC", "STAT_PRICE_IND", "STAT_DATA_GOV"],
            "benchmarks": {
                "STAT_SURVEY": 80.0,
                "STAT_NAT_ACC": 85.0,
                "STAT_COMPUTE": 80.0,
                "STAT_PRICE_IND": 75.0,
                "STAT_LABOUR": 80.0,
                "STAT_DATA_GOV": 75.0,
                "STAT_QUALITY": 80.0,
                "STAT_VIZ_COMM": 70.0,
                "STAT_IND_AGRI": 75.0
            },
            "weights": {
                "STAT_SURVEY": 1.2,
                "STAT_NAT_ACC": 1.3,
                "STAT_COMPUTE": 1.2,
                "STAT_PRICE_IND": 1.0,
                "STAT_LABOUR": 1.1,
                "STAT_DATA_GOV": 1.0,
                "STAT_QUALITY": 1.1,
                "STAT_VIZ_COMM": 0.9,
                "STAT_IND_AGRI": 1.0
            }
        }
    else:
        div_profile = DIVISION_PROFILES[selected_div_key]

    # 2. Match Designation Modifiers
    delta = 0.0
    weight_mult = 1.0
    seniority = "Statistical Officer"

    for desig_key, modifier in DESIGNATION_MODIFIERS.items():
        if desig_key.lower() in desig_str:
            delta = modifier["benchmark_delta"]
            weight_mult = modifier["weight_multiplier"]
            seniority = modifier["seniority"]
            break

    # 3. Calculate calibrated benchmarks and weights
    calibrated_benchmarks = {}
    calibrated_weights = {}

    for comp_code, base_val in div_profile["benchmarks"].items():
        calibrated_benchmarks[comp_code] = min(98.0, max(60.0, round(base_val + delta, 1)))

    for comp_code, base_w in div_profile["weights"].items():
        calibrated_weights[comp_code] = round(base_w * weight_mult, 2)

    return {
        "division_name": selected_div_key or "MoSPI Statistical System",
        "division_code": div_profile.get("division_code", "GEN"),
        "cadre_seniority": seniority,
        "core_competencies": div_profile["core_competencies"],
        "benchmarks": calibrated_benchmarks,
        "weights": calibrated_weights
    }

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

    # Resolve role-specific benchmark targets and weights
    role_meta = resolve_role_benchmarks(
        department=user.department if user else "",
        designation=user.designation if user else ""
    )

    details: List[UserCompetencyDetail] = []
    total_score = 0.0
    met_count = 0
    gaps_count = 0

    for comp in all_competencies:
        uc = user_comp_map.get(comp.id)
        current = uc.current_level if uc else 0.0
        
        # Use role-specific required benchmark from dataset
        role_req = role_meta["benchmarks"].get(comp.code, comp.required_level)
        is_core = comp.code in role_meta["core_competencies"]
        
        gap = calculate_gap(role_req, current)
        priority = get_priority_label(gap)

        if gap == 0.0 and current >= role_req:
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
                required_level=role_req,
                current_level=current,
                gap=gap,
                priority=priority,
                is_role_core=is_core,
                last_assessed_at=uc.last_assessed_at if uc else None
            )
        )

    overall_readiness = round(total_score / len(all_competencies), 1) if all_competencies else 0.0

    return CompetencyProfileOut(
        overall_readiness_score=overall_readiness,
        total_competencies=len(all_competencies),
        competencies_met_count=met_count,
        active_gaps_count=gaps_count,
        user_division=user.department if user else "MoSPI",
        user_designation=user.designation if user else "Statistical Officer",
        cadre_seniority=role_meta["cadre_seniority"],
        competencies=details
    )

def analyze_competency_gaps(user_id: int, db: Session) -> CompetencyGapAnalysisOut:
    profile = get_user_competency_profile(user_id, db)
    user = db.query(User).filter(User.id == user_id).first()
    
    role_meta = resolve_role_benchmarks(
        department=user.department if user else "",
        designation=user.designation if user else ""
    )

    gap_items: List[CompetencyGapItem] = []
    domain_gap_counts: Dict[str, float] = {}

    for item in profile.competencies:
        role_weight = role_meta["weights"].get(item.code, 1.0)
        priority_score = round(item.gap * role_weight, 2)

        focus_action = f"Complete recommended iGOT courses & MoSPI study material on {item.name}"
        if item.priority == "High":
            focus_action = f"Immediate priority for {user.department if user else 'your role'}: Study core methodology for {item.name} and take verification quizzes."
        elif item.priority == "Met":
            focus_action = f"Benchmark of {item.required_level}% achieved. Continue periodic refresher assessments."

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
                is_role_core=item.is_role_core,
                recommended_focus_action=focus_action
            )
        )

        if item.gap > 0:
            domain_gap_counts[item.domain] = domain_gap_counts.get(item.domain, 0.0) + item.gap

    # Sort gaps deterministically by priority score descending
    gap_items.sort(key=lambda x: x.priority_score, reverse=True)

    critical_count = sum(1 for g in gap_items if g.priority == "High")

    # Safe handling of domain gap counts when 0 gaps exist or collection is empty
    if domain_gap_counts:
        primary_domain = max(domain_gap_counts.items(), key=lambda x: x[1])[0]
    elif profile.competencies:
        primary_domain = profile.competencies[0].domain
    else:
        primary_domain = "Survey Operations"

    # AI diagnosis summary with division and designation context
    active_gaps = [g.dict() for g in gap_items if g.gap > 0]
    ai_summary = generate_gap_diagnosis(
        officer_name=user.full_name if user else "Officer",
        designation=user.designation if user else "Statistical Officer",
        gaps=active_gaps,
        overall_readiness=profile.overall_readiness_score,
        division=user.department if user else "MoSPI"
    )

    return CompetencyGapAnalysisOut(
        total_gaps_identified=len(active_gaps),
        critical_gaps_count=critical_count,
        primary_focus_domain=primary_domain,
        user_division=user.department if user else "MoSPI",
        user_designation=user.designation if user else "Statistical Officer",
        cadre_seniority=role_meta["cadre_seniority"],
        gaps=gap_items,
        ai_diagnosis_summary=ai_summary
    )
