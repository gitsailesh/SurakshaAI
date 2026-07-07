# 1. Build and push to the correct path
gcloud builds submit --tag asia-south1-docker.pkg.dev/suraksha-ai-501609/suraksha-repo/backend:latest .

# 2. Deploy to Cloud Run using that image
gcloud run deploy suraksha-backend \
    --image asia-south1-docker.pkg.dev/suraksha-ai-501609/suraksha-repo/backend:latest \
    --region asia-south1 \
    --platform managed \
    --allow-unauthenticated