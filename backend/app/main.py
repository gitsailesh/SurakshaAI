from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import analysis, inventory  # These are your route modules

# Professional metadata for the Hackathon judges
app = FastAPI(
    title="SurakshaAI API", 
    description="Intelligent Health Resource Orchestration for Nagpur District",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"
)

# CORS Configuration - Vital for Next.js to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTER REGISTRATION ---

# Mounts the Inventory Router (handles CSV uploads and Gemini Vision)
app.include_router(
    inventory.router, 
    prefix="/api/v1/inventory", 
    tags=["Inventory Management"]
)

# Mounts the Analysis Router (handles general district-wide reasoning)
app.include_router(
    analysis.router, 
    prefix="/api/v1/analysis", 
    tags=["AI Analysis"]
)

@app.get("/health")
async def health():
    """Service Health Probe"""
    return {
        "status": "active", 
        "service": "SurakshaAI-Backend",
        "region": "asia-south1 (Nagpur Hub)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)