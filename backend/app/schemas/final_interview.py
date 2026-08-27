from typing import List, Optional
from pydantic import BaseModel, Field

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

class FinalInterviewAnswerSubmit(BaseModel):
    question: str = Field(..., min_length=5, max_length=1000)
    answer: str = Field(..., min_length=2, max_length=5000)
    competency: str = Field(..., min_length=2, max_length=255)
    domain: str = Field(..., min_length=2, max_length=255)
    difficulty: str = Field(default="Intermediate", pattern="^(Foundational|Beginner|Intermediate|Advanced|Expert)$")

class FinalInterviewAnswerEvaluation(BaseModel):
    score: int = Field(..., ge=0, le=10)
    evaluation: str
    strengths: List[str]
    weaknesses: List[str]
    next_difficulty: str