from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class ProgressEventOut(BaseModel):
    id: int
    competency_id: int
    competency_name: str
    domain: str
    event_type: str
    previous_score: float
    new_score: float
    delta: float
    created_at: datetime

    class Config:
        from_attributes = True

class CompetencyProgressCard(BaseModel):
    competency_id: int
    code: str
    name: str
    domain: str
    initial_score: float
    current_score: float
    required_benchmark: float
    total_gain: float
    status: str # 'Improving', 'Mastered', 'Needs Attention'

class ProgressSummaryOut(BaseModel):
    user_id: int
    user_name: str
    designation: str
    department: str
    overall_readiness_score: float
    total_learning_gain: float
    quizzes_completed: int
    average_quiz_score: float
    competency_breakdown: List[CompetencyProgressCard]
    recent_events: List[ProgressEventOut]
