import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Dime Expert Advisor (DEA)"
    ENV: str = os.getenv("ENV", "development")
    
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "cloud")
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_DEEPSEEK_MODEL: str = "deepseek-r1:8b"
    OLLAMA_QWEN_MODEL: str = "qwen2.5:7b"

    
    DATABASE_URL: str = "sqlite:///./dea_journal.db"

    class Config:
        env_file = ".env"

settings = Settings()
