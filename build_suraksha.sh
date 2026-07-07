#!/bin/bash

echo "🚀 Initializing SurakshaAI Production Environment..."

# 1. Create Directory Structure
mkdir -p backend/app/api/v1 backend/app/core backend/app/services backend/app/schemas backend/app/models backend/app/utils backend/tests
mkdir -p frontend/src/app/dashboard/insights frontend/src/components/layout frontend/src/components/maps frontend/src/components/ai frontend/src/services frontend/src/store frontend/src/theme
mkdir -p scripts terraform .github/workflows

# 2. Create Backend Files
cat <<EOF > backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import analysis, inventory

app = FastAPI(title="SurakshaAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "active", "service": "SurakshaAI-Backend"}

# Routes will be registered here
EOF

cat <<EOF > backend/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_ID: str = "suraksha-ai"
    GEMINI_API_KEY: str = ""
    FIREBASE_SERVICE_ACCOUNT: str = ""
    ENVIRONMENT: str = "production"

    class Config:
        env_file = ".env"

settings = Settings()
EOF

cat <<EOF > backend/app/services/ai_engine.py
import google.generativeai as genai
import json
from app.core.config import settings

class SurakshaAIEngine:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def analyze_district_risks(self, data: dict):
        prompt = f"Analyze these PHC metrics and return a JSON redistribution plan: {data}"
        response = self.model.generate_content(
            prompt, 
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
EOF

cat <<EOF > backend/requirements.txt
fastapi
uvicorn
google-generativeai
pydantic-settings
firebase-admin
pandas
python-multipart
pytest
EOF

cat <<EOF > backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
EOF

# 3. Create Frontend Boilerplate
cat <<EOF > frontend/src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4285F4' },
    secondary: { main: '#34A853' },
    background: { default: '#0B0E11', paper: '#15191C' },
  },
  shape: { borderRadius: 12 },
});
EOF

cat <<EOF > frontend/src/services/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInsights = async (districtId: string) => {
  const res = await fetch(\`\${API_URL}/api/v1/analysis/district/\${districtId}\`);
  return res.json();
};
EOF

# 4. Create Utility Scripts
cat <<EOF > scripts/seed_data.py
import uuid
import json

def generate_mock_phc():
    return {
        "id": str(uuid.uuid4()),
        "name": "Sample PHC",
        "inventory": {"insulin": 50, "paracetamol": 100}
    }

if __name__ == "__main__":
    print(json.dumps([generate_mock_phc() for _ in range(5)], indent=2))
EOF

# 5. Create Deployment Script
cat <<EOF > deploy.sh
#!/bin/bash
PROJECT_ID=\$(gcloud config get-value project)
echo "Deploying SurakshaAI to \$PROJECT_ID..."
gcloud builds submit --tag gcr.io/\$PROJECT_ID/suraksha-backend ./backend
gcloud run deploy suraksha-backend --image gcr.io/\$PROJECT_ID/suraksha-backend --platform managed --region asia-south1 --allow-unauthenticated
EOF

chmod +x deploy.sh

echo "------------------------------------------------"
echo "✅ SurakshaAI Project Structure Created!"
echo "------------------------------------------------"
echo "Next Steps:"
echo "1. cd backend && pip install -r requirements.txt"
echo "2. Add your GEMINI_API_KEY to backend/app/core/config.py"
echo "3. Run 'bash deploy.sh' to push to Google Cloud."