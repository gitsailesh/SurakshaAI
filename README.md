# Project Name: SurakshaAI (Nagpur District Hub)

## Subtitle

**Strategic Health Resource Orchestration: Transforming Rural Healthcare from Reactive to Proactive using Multimodal Gemini Intelligence**

---

# 🚀 Inspiration

In the Nagpur district of Maharashtra, Primary Health Centres (PHCs) often operate in an **information vacuum**. A Medical Officer in a remote village like Kalmeshwar might run out of life-saving Insulin during a heatwave, but the District Health Officer (DHO) in the city doesn't find out until days later.

This **Information Lag** costs lives.

**SurakshaAI** was born to bridge this gap by creating a Generative AI-powered Health Command Center that thinks, reasons, predicts, and assists public health administrators in making faster, data-driven decisions.

---

# 💡 What it does

SurakshaAI is an AI-powered Command Center for District Health Administration.

It performs three mission-critical functions:

## 🏥 Strategic Redistribution

Instead of simply tracking inventory, Gemini analyzes district-wide CSV/Excel datasets to identify surplus-to-deficit medicine transfer opportunities based on:

- Medical urgency
- Geographic proximity
- Predicted demand
- Stock availability

Example:

> Move Insulin from Hingna PHC to Kalmeshwar PHC before shortages impact patient care.

---

## 📷 Multimodal Inventory Capture

ASHA workers and Medical Officers can simply capture a photo of medicine shelves.

Gemini Vision automatically converts images into structured inventory data, eliminating manual data entry and reducing human errors.

---

## 📊 Executive Intelligence

District Health Officers receive AI-generated multilingual briefings in:

- English
- Hindi
- Marathi

The dashboard highlights:

- Critical shortages
- High-risk PHCs
- Disease trends
- Suggested redistribution plans
- Executive summaries

---

# 🛠 How I built it

## AI Engine

- Google GenAI SDK
- Gemini 1.5 Pro
- Gemini 1.5 Flash (Vision)

Gemini Pro performs advanced reasoning while Gemini Flash processes images and generates summaries.

---

## Backend

- FastAPI (Python 3.13)
- Google Cloud Run
- Pandas
- Repository Pattern
- REST APIs

---

## Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Material UI v6
- Zustand

---

## Maps & Visualization

- Google Maps Platform
- Advanced Markers
- Dark Theme Health Grid

---

## Deployment

- Docker
- Google Artifact Registry
- Google Cloud Run
- Firebase Hosting

---

# 🧠 AI Reasoning (Beyond Simple Rules)

SurakshaAI doesn't rely on hardcoded thresholds.

Gemini reasons across district-wide datasets using multiple factors.

## 🩺 Medical Triage

Prioritizes:

- Oxygen
- Insulin
- Anti-venom
- Emergency medicines

before recommending redistribution.

---

## 📍 Geographic Optimization

Uses PHC coordinates to recommend nearby redistribution routes, minimizing transport time and operational cost.

---

## 🦟 Disease Pattern Detection

Identifies trends like:

- Fever outbreaks
- Dengue
- Malaria
- Diarrhea

and recommends proactive stock movement of diagnostic kits and medicines.

---

# 🚧 Challenges I overcame

## React 19 + Material UI Compatibility

Refactored traditional Grid layouts into modern Flexbox/Box components to eliminate React 19 compatibility warnings.

---

## SDK Modernization

Migrated from the deprecated `google-generativeai` SDK to the latest `google-genai` SDK to ensure future compatibility.

---

## Next.js Hydration Issues

Solved SSR hydration mismatches by implementing client-side time rendering for the Nagpur Standard Time dashboard.

---

# 🏅 Accomplishments

- Successfully converted medicine shelf images into structured inventory using Gemini Vision.
- Built a responsive dashboard supporting 100+ PHCs without noticeable latency.
- Enabled multilingual AI-generated health briefings.
- Designed a production-ready architecture for district-scale healthcare deployments.

---

# 📖 What I learned

- Leveraging Gemini's large context window for district-wide reasoning.
- Building scalable AI services using Cloud Run.
- Designing accessible UX for government officials working under time-sensitive conditions.
- Using multimodal AI to reduce administrative workload in rural healthcare.

---

# 🚀 What's next for SurakshaAI

## 👥 Role-Based Secure Accounts

Introduce authentication and personalized dashboards for:

- District Health Officers (DHO)
- District Administrators / Collectors
- Chief Medical Officers (CMO)
- Taluka Medical Officers
- Primary Health Centre (PHC) Medical Officers
- Community Health Centre (CHC) Administrators
- ASHA Workers
- ANM (Auxiliary Nurse Midwives)
- Pharmacists
- Store Managers
- Ambulance Coordinators
- State Health Department Officials

Each role will have customized permissions, AI recommendations, and operational workflows.

---

## 📱 Mobile App for ASHA Workers

Develop an offline-first mobile application that enables ASHA workers to:

- Capture medicine shelf images
- Report medicine shortages
- Record patient visits
- Track maternal and child healthcare
- Receive vaccination reminders
- Synchronize data automatically when internet connectivity becomes available

---

## 🏥 PHC & Hospital Portal

Provide Medical Officers with capabilities to:

- Update medicine inventory
- Request emergency supplies
- Track redistribution requests
- View AI-generated shortage predictions
- Monitor disease trends

---

## 🏛 District Administration Dashboard

Provide district administrators with:

- District-wide health monitoring
- Medicine availability heatmaps
- Disease surveillance dashboards
- Resource optimization recommendations
- Budget utilization insights
- Emergency response coordination

---

## 🤖 Predictive Disease Intelligence

Integrate:

- Weather forecasts
- Rainfall data
- Mosquito breeding conditions
- Population density
- Historical disease records

to predict:

- Dengue
- Malaria
- Heat Stroke
- Waterborne Diseases

before outbreaks occur.

---

## 🚑 Smart Logistics

Integrate with:

- Google Maps Routes API
- Ambulance dispatch systems
- Government transport services

to automate medicine redistribution and optimize delivery routes.

---

## 💬 Conversational AI for Health Administrators

Enable natural language interactions such as:

> Which PHCs will run out of Insulin this week?

> Show villages with the highest Dengue risk.

> Generate today's District Health Briefing.

> Recommend medicine redistribution for tomorrow.

---

## 📊 Population Health Analytics

Generate district-level insights on:

- Vaccination coverage
- Maternal healthcare
- Child nutrition
- Chronic disease trends
- Medicine consumption forecasting
- Resource utilization

---

## 🔗 Government System Integration

Integrate with national healthcare platforms including:

- Ayushman Bharat Digital Mission (ABDM)
- Health Management Information System (HMIS)
- eSanjeevani
- CoWIN
- National Digital Health Mission (NDHM)
- State Health Data Platforms

---

# 🏗 Built With

### AI

- Gemini 1.5 Pro
- Gemini 1.5 Flash
- Google GenAI SDK

### Frontend

- Next.js 15
- React 19
- TypeScript
- Material UI
- Zustand

### Backend

- FastAPI
- Python 3.13
- Pandas

### Cloud

- Google Cloud Run
- Firebase Hosting
- Artifact Registry
- Docker

### Maps

- Google Maps Platform
- Advanced Markers

### Architecture

- REST APIs
- Repository Pattern
- Containerized Microservices
