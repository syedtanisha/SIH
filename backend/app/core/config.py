from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "MoSPI AI-Enabled Statistical Learning Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "mospi_official_statistical_learning_platform_super_secret_jwt_key_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    DATABASE_URL: str = "sqlite:///./statlearn.db"

    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    AI_PROVIDER: str = "auto"

    IGOT_API_BASE_URL: str = "https://api.igotkarmayogi.gov.in/v1"
    IGOT_CLIENT_ID: Optional[str] = None
    IGOT_CLIENT_SECRET: Optional[str] = None
    IGOT_SANDBOX_MODE: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
