from pydantic import BaseModel, Field, HttpUrl
from uuid import UUID, uuid4
from typing import List, Optional, Dict
from datetime import datetime

class BaseNode(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class InventoryItem(BaseNode):
    name: str
    category: str  # Medicine, Lab Kit, Oxygen, Vaccine
    current_stock: int
    min_threshold: int
    unit: str  # vials, tablets, liters
    expiry_date: datetime
    batch_no: str
    image_url: Optional[str] = None # Public URL from Firebase Storage

class PHC(BaseNode):
    name: str
    district_id: UUID
    latitude: float
    longitude: float
    bed_capacity: int
    current_occupancy: int
    doctors_available: int
    ambulances_active: int
    contact_no: str
    address: str

class AIRecommendation(BaseNode):
    phc_id: UUID
    type: str  # REDISTRIBUTION, PROCUREMENT, STAFFING
    priority: str  # CRITICAL, HIGH, MEDIUM
    action_item: str
    reasoning: str
    confidence_score: float
    impact_metrics: Dict[str, float] # e.g., {"lives_saved": 1.2, "cost_avoided_inr": 45000}

class AtRiskPHC(BaseModel):
    name: str
    reason: str
    urgency: str

class RedistributionOrder(BaseModel):
    from_phc: str
    to_phc: str
    item: str
    quantity: int
    urgency: str
    reasoning: str
    impact_score: str

class AnalysisResponse(BaseModel):
    executive_summary: str
    at_risk_phcs: List[AtRiskPHC]
    redistributions: List[RedistributionOrder]
    district_health_score: int