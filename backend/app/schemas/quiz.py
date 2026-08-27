from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class MCQOption(BaseModel):
    key: str # 'A', 'B', 'C', 'D'
    text: str

class MCQGeneratedQuestion(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str = Field(..., description="Must be 'A', 'B', 'C', or 'D'")
    explanation: str
    difficulty: str = "Intermediate"
    competency_code: Optional[str] = None

class QuizGenerateRequest(BaseModel):
    document_id: Optional[int] = None
    resource_id: Optional[int] = None
    custom_text: Optional[str] = None
    topic: str
    num_questions: int = Field(default=5, ge=1, le=20)
    difficulty: str = "Intermediate"
    competency_id: Optional[int] = None

class QuizQuestionOut(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    difficulty: str

    class Config:
        from_attributes = True

class QuizQuestionDetailOut(QuizQuestionOut):
    correct_option: str
    explanation: str

class QuizOut(BaseModel):
    id: int
    title: str
    topic: str
    difficulty: str
    total_questions: int
    time_limit_mins: int
    created_at: datetime
    questions: List[QuizQuestionOut]

    class Config:
        from_attributes = True

class QuizAnswerSubmit(BaseModel):
    question_id: int
    selected_option: str # 'A', 'B', 'C', 'D'

class QuizSubmitRequest(BaseModel):
    answers: List[QuizAnswerSubmit]

class QuestionResultDetail(BaseModel):
    question_id: int
    question_text: str
    user_selected: str
    correct_option: str
    is_correct: bool
    explanation: str

class QuizAttemptResultOut(BaseModel):
    attempt_id: int
    quiz_id: int
    quiz_title: str
    score: float # Percentage
    total_correct: int
    total_questions: int
    competency_name: Optional[str] = None
    competency_score_before: float
    competency_score_after: float
    competency_delta: float
    ai_qualitative_feedback: str
    question_results: List[QuestionResultDetail]
    completed_at: datetime
