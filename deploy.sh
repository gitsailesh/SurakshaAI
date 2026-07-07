#!/bin/bash
PROJECT_ID=$(gcloud config get-value project)
echo "Deploying SurakshaAI to $PROJECT_ID..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/suraksha-backend ./backend
gcloud run deploy suraksha-backend --image gcr.io/$PROJECT_ID/suraksha-backend --platform managed --region asia-south1 --allow-unauthenticated
