from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CompetencyBase(BaseModel):
    code: str
    name: str
    domain: str
    description: Optional[str] = None
    required_level: float = 80.0
    weight: float = 1.0

class CompetencyCreate(CompetencyBase):
    pass

class CompetencyOut(CompetencyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserCompetencyDetail(BaseModel):
    competency_id: int
    code: str
    name: str
    domain: str
    description: Optional[str] = None
    required_level: float
    current_level: float
    gap: float
    priority: str # 'High', 'Medium', 'Low', 'Met'
    is_role_core: bool = False
    last_assessed_at: Optional[datetime] = None

class CompetencyProfileOut(BaseModel):
    overall_readiness_score: float
    total_competencies: int
    competencies_met_count: int
    active_gaps_count: int
    user_division: Optional[str] = None
    user_designation: Optional[str] = None
    cadre_seniority: Optional[str] = None
    competencies: List[UserCompetencyDetail]

class CompetencyGapItem(BaseModel):
    competency_id: int
    code: str
    name: str
    domain: str
    current_level: float
    required_level: float
    gap: float
    priority: str
    priority_score: float
    is_role_core: bool = False
    recommended_focus_action: str

class CompetencyGapAnalysisOut(BaseModel):
    total_gaps_identified: int
    critical_gaps_count: int
    primary_focus_domain: str
    user_division: Optional[str] = None
    user_designation: Optional[str] = None
    cadre_seniority: Optional[str] = None
    gaps: List[CompetencyGapItem]
    ai_diagnosis_summary: str
