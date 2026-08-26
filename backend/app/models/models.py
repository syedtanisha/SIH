from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    designation = Column(String(255), default="Statistical Professional")
    department = Column(String(255), default="MoSPI")
    organization = Column(String(255), default="Government of India")
    role = Column(String(50), default="user") # 'user', 'trainer', 'admin'
    created_at = Column(DateTime, default=datetime.utcnow)

    competencies = relationship("UserCompetency", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("LearningProgressHistory", back_populates="user", cascade="all, delete-orphan")


class Competency(Base):
    __tablename__ = "competencies"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    domain = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    required_level = Column(Float, default=80.0) # Benchmark target percentage
    weight = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_competencies = relationship("UserCompetency", back_populates="competency")
    resource_mappings = relationship("ResourceCompetencyMapping", back_populates="competency")


class UserCompetency(Base):
    __tablename__ = "user_competencies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    competency_id = Column(Integer, ForeignKey("competencies.id", ondelete="CASCADE"), nullable=False, index=True)
    current_level = Column(Float, default=0.0) # percentage: 0.0 to 100.0
    last_assessed_at = Column(DateTime, default=datetime.utcnow)
    assessment_source = Column(String(50), default="initial")

    user = relationship("User", back_populates="competencies")
    competency = relationship("Competency", back_populates="user_competencies")

    __table_args__ = (UniqueConstraint('user_id', 'competency_id', name='_user_competency_uc'),)


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    source = Column(String(50), nullable=False) # 'iGOT_Karmayogi', 'NSSTA', 'MoSPI'
    official_url = Column(String(1000), nullable=False)
    resource_type = Column(String(50), nullable=False) # 'CBP_Course', 'Training_Module', 'Publication', 'Dataset', 'Video'
    difficulty = Column(String(50), default="Intermediate")
    estimated_duration_mins = Column(Integer, default=60)
    thumbnail_url = Column(String(1000), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    competency_mappings = relationship("ResourceCompetencyMapping", back_populates="resource", cascade="all, delete-orphan")


class ResourceCompetencyMapping(Base):
    __tablename__ = "resource_competency_mappings"

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(Integer, ForeignKey("learning_resources.id", ondelete="CASCADE"), nullable=False)
    competency_id = Column(Integer, ForeignKey("competencies.id", ondelete="CASCADE"), nullable=False)
    relevance_score = Column(Float, default=1.0)

    resource = relationship("LearningResource", back_populates="competency_mappings")
    competency = relationship("Competency", back_populates="resource_mappings")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False) # 'pdf', 'docx', 'pptx', 'txt'
    file_size_bytes = Column(Integer, default=0)
    extracted_text = Column(Text, nullable=False)
    character_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")
    quizzes = relationship("Quiz", back_populates="document")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    competency_id = Column(Integer, ForeignKey("competencies.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    topic = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="Intermediate")
    total_questions = Column(Integer, default=5)
    time_limit_mins = Column(Integer, default=15)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="quizzes")
    document = relationship("Document", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    correct_option = Column(String(1), nullable=False) # 'A', 'B', 'C', 'D'
    explanation = Column(Text, nullable=False)
    competency_code = Column(String(50), nullable=True)
    difficulty = Column(String(50), default="Intermediate")

    quiz = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Float, nullable=False) # Percentage: 0 - 100
    total_correct = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    competency_id = Column(Integer, ForeignKey("competencies.id", ondelete="SET NULL"), nullable=True)
    competency_score_before = Column(Float, default=0.0)
    competency_score_after = Column(Float, default=0.0)
    competency_delta = Column(Float, default=0.0)
    ai_qualitative_feedback = Column(Text, nullable=True)
    completed_at = Column(DateTime, default=datetime.utcnow)

    quiz = relationship("Quiz", back_populates="attempts")
    user = relationship("User", back_populates="quiz_attempts")


class LearningProgressHistory(Base):
    __tablename__ = "learning_progress_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    competency_id = Column(Integer, ForeignKey("competencies.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False) # 'baseline_assessment', 'quiz_completed', 'course_completed'
    previous_score = Column(Float, nullable=False)
    new_score = Column(Float, nullable=False)
    delta = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progress_records")
