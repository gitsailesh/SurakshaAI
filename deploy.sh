#!/bin/bash
PROJECT_ID=$(gcloud config get-value project)
echo "Deploying SurakshaAI to $PROJECT_ID..."
gcloud builds submit --tag asia-south1-docker.pkg.dev/$PROJECT_ID/suraksha-repo/suraksha-backend:latest ./backend
gcloud run deploy suraksha-backend --image asia-south1-docker.pkg.dev/$PROJECT_ID/suraksha-repo/suraksha-backend:latest --platform managed --region asia-south1 --allow-unauthenticated
