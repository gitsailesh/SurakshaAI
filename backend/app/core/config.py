# backend/app/core/config.py
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

def fetch_secret(secret_id: str, default: str) -> str:
    # 1. Check if it's already set in the environment
    val = os.getenv(secret_id)
    if val:
        return val
        
    # 2. Try loading from Secret Manager
    project_id = os.getenv("PROJECT_ID", "suraksha-ai-501609")
    try:
        from google.cloud import secretmanager
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
        response = client.access_secret_version(request={"name": name})
        secret_val = response.payload.data.decode("UTF-8").strip()
        if secret_val:
            return secret_val
    except Exception:
        # Ignore and fall back to default/local config
        pass
        
    return default

class Settings(BaseSettings):
    GEMINI_API_KEY: str = Field(default="")
    PROJECT_ID: str = "suraksha-ai-501609"
    ENVIRONMENT: str = "development"

    # This tells Pydantic where to find the .env file relative to this file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    def __init__(self, **values):
        super().__init__(**values)
        # Fetch or override parameters dynamically using Secret Manager
        self.GEMINI_API_KEY = fetch_secret("GEMINI_API_KEY", self.GEMINI_API_KEY)
        self.PROJECT_ID = fetch_secret("PROJECT_ID", self.PROJECT_ID)
        self.ENVIRONMENT = fetch_secret("ENVIRONMENT", self.ENVIRONMENT)

try:
    settings = Settings()
    if not settings.GEMINI_API_KEY:
        print("⚠️ Warning: GEMINI_API_KEY is empty. Ensure it is set in .env, environment, or Google Secret Manager.")
except Exception as e:
    print("❌ ERROR: Initializing Settings failed")
    raise e