# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # This will look for GEMINI_API_KEY in your environment or .env file
    GEMINI_API_KEY: str = Field(..., env="GEMINI_API_KEY") 
    PROJECT_ID: str = "suraksha-ai-501609"
    ENVIRONMENT: str = "development"

    # This tells Pydantic where to find the .env file relative to this file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

try:
    settings = Settings()
except Exception as e:
    print("❌ ERROR: Missing Environment Variables. Did you create a .env file in the backend folder?")
    raise e