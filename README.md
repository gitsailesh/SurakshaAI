# SurakshaAI - Nagpur District Health Intelligence

**Objective:** AI-powered resource orchestration for 100+ PHCs in Nagpur, India.

### 🧠 The "Real AI" Reasoning
Unlike simple CRUD apps, SurakshaAI uses **Gemini 1.5 Pro** to perform:
- **Constraint Satisfaction:** Redistributing stock based on Nagpur's geography (Kalmeshwar ➔ Hingna).
- **Medical Prioritization:** Prioritizing Insulin/Oxygen over general supplies.
- **Multimodal Perception:** Converting handwritten ledgers/photos into structured data.

### 🏗 Tech Stack
- **AI:** Google GenAI SDK (v1.0), Gemini 1.5 Pro & Flash.
- **Backend:** FastAPI (Python 3.13), Pandas for data sanitization.
- **Frontend:** Next.js 15 (App Router), React 19, MUI v6, Zustand.
- **Cloud:** Google Cloud Run, Artifact Registry, Firebase (Hosting/Auth).

### 🚀 Live Demo Flow
1. **Initial View:** Empty Nagpur Map (Awaiting Data).
2. **Data Sync:** Upload `nagpur_data.csv`.
3. **Reasoning:** AI generates 3 critical redistributions to avoid stock-outs.
4. **Accessibility:** Click "Speak" to hear the briefing in Marathi/Hindi.