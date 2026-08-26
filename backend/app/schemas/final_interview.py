from typing import List
from pydantic import BaseModel


class FinalInterviewCompetency(BaseModel):
    competency_id: int
    code: str
    name: str
    domain: str
    current_score: float
    required_benchmark: float
    gap: float


class FinalInterviewReadiness(BaseModel):
    eligible: bool
    readiness_score: float
    competencies_to_assess: List[FinalInterviewCompetency]
    message: str
    