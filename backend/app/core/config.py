from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "MoSPI AI-Enabled Statistical Learning Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "mospi_official_statistical_learning_platform_super_secret_jwt_key_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    DATABASE_URL: str = "sqlite:///./statlearn.db"

    GROK_API_KEY: Optional[str] = None
    XAI_API_KEY: Optional[str] = None
    GROK_MODEL: str = "grok-2-latest"
    XAI_BASE_URL: str = "https://api.x.ai/v1"
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    AI_PROVIDER: str = "auto"
    LLM_MAX_RETRIES: int = 2
    LLM_TIMEOUT_SECONDS: float = 30.0

    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"

    IGOT_API_BASE_URL: str = "https://api.igotkarmayogi.gov.in/v1"
    IGOT_CLIENT_ID: Optional[str] = None
    IGOT_CLIENT_SECRET: Optional[str] = None
    IGOT_SANDBOX_MODE: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
