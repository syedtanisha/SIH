from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from ..db.database import get_db
from ..models.models import LearningResource, ResourceCompetencyMapping
from ..schemas.resource import LearningResourceOut

router = APIRouter(prefix="/resources", tags=["Government Learning Hub Resources"])

@router.get("", response_model=List[LearningResourceOut])
def list_resources(
    source: Optional[str] = Query(None, description="Filter by source: 'iGOT_Karmayogi', 'NSSTA', 'MoSPI'"),
    resource_type: Optional[str] = Query(None, description="Filter by type: 'CBP_Course', 'Training_Module', 'Publication', 'Dataset'"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = (
        db.query(LearningResource)
        .options(
            selectinload(LearningResource.competency_mappings)
            .selectinload(ResourceCompetencyMapping.competency)
        )
        .filter(LearningResource.is_active == True)
    )
    if source:
        query = query.filter(LearningResource.source == source)
    if resource_type:
        query = query.filter(LearningResource.resource_type == resource_type)
    if difficulty:
        query = query.filter(LearningResource.difficulty == difficulty)
    
    resources = query.limit(limit).offset(offset).all()
    results = []
    for r in resources:
        aligned_codes = [m.competency.code for m in r.competency_mappings if m.competency]
        results.append(
            LearningResourceOut(
                id=r.id,
                title=r.title,
                description=r.description,
                source=r.source,
                official_url=r.official_url,
                resource_type=r.resource_type,
                difficulty=r.difficulty,
                estimated_duration_mins=r.estimated_duration_mins,
                thumbnail_url=r.thumbnail_url,
                aligned_competencies=aligned_codes
            )
        )
    return results
