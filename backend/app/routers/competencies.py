from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db.database import get_db
from ..models.models import Competency, User
from ..schemas.competency import CompetencyOut, CompetencyProfileOut, CompetencyGapAnalysisOut
from ..core.security import get_current_user
from ..services.competency_service import get_user_competency_profile, analyze_competency_gaps

router = APIRouter(prefix="/competencies", tags=["Competencies"])

@router.get("", response_model=List[CompetencyOut])
def list_competencies(
    domain: Optional[str] = Query(None, description="Filter by statistical domain"),
    db: Session = Depends(get_db)
):
    query = db.query(Competency)
    if domain:
        query = query.filter(Competency.domain == domain)
    return query.all()

@router.get("/profile", response_model=CompetencyProfileOut)
def get_my_competency_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_competency_profile(current_user.id, db)

@router.get("/gap-analysis", response_model=CompetencyGapAnalysisOut)
def get_my_gap_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return analyze_competency_gaps(current_user.id, db)
