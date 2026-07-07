# Set your Project ID
PROJECT_ID="suraksha-ai-501609"

# 1. Enable APIs
gcloud services enable \
    run.googleapis.com \
    containerregistry.googleapis.com \
    artifactregistry.googleapis.com \
    aiplatform.googleapis.com \
    secretmanager.googleapis.com \
    firestore.googleapis.com

# 2. Create Artifact Registry for Docker images
gcloud artifacts repositories create suraksha-repo \
    --repository-format=docker \
    --location=asia-south1 \
    --description="SurakshaAI Docker Repository"

# 3. Store Gemini API Key in Secret Manager (Secure)
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=-