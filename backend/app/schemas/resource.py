from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LearningResourceOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    source: str # 'iGOT_Karmayogi', 'NSSTA', 'MoSPI'
    official_url: str
    resource_type: str
    difficulty: str
    estimated_duration_mins: int
    thumbnail_url: Optional[str] = None
    aligned_competencies: List[str] = []

    class Config:
        from_attributes = True

class RecommendationItem(BaseModel):
    resource: LearningResourceOut
    matched_competency_code: str
    matched_competency_name: str
    competency_gap: float
    relevance_reason: str
    match_score: float

class RecommendationResponse(BaseModel):
    primary_focus_gap: str
    gap_percentage: float
    total_recommendations: int
    recommendations: List[RecommendationItem]
    ai_curation_note: str
