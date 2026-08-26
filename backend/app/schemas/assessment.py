from pydantic import BaseModel
from typing import List, Dict, Optional

class BaselineQuestionOption(BaseModel):
    key: str # 'A', 'B', 'C', 'D'
    text: str

class BaselineQuestion(BaseModel):
    id: int
    competency_code: str
    competency_name: str
    domain: str
    question_text: str
    options: List[BaselineQuestionOption]
    difficulty: str

class BaselineAssessmentOut(BaseModel):
    assessment_id: str
    title: str
    instructions: str
    total_questions: int
    time_limit_mins: int
    questions: List[BaselineQuestion]

class BaselineAnswerSubmit(BaseModel):
    question_id: int
    selected_option: str # 'A', 'B', 'C', 'D'

class BaselineAssessmentSubmit(BaseModel):
    answers: List[BaselineAnswerSubmit]

class BaselineAssessmentResultOut(BaseModel):
    overall_score: float
    total_correct: int
    total_questions: int
    domain_scores: Dict[str, float]
    competency_scores: Dict[str, float]
    initialized_competencies_count: int
    feedback_summary: str
