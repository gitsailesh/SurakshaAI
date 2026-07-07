from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.vision_service import InventoryVisionService
from app.services.reasoning_engine import StrategicReasoningEngine
from uuid import UUID, uuid4
import pandas as pd
import io
from datetime import datetime

router = APIRouter()

# Instantiate both services
vision_service = InventoryVisionService()
reasoning_engine = StrategicReasoningEngine()

# --- MODE 1: PHOTO UPLOAD (For ASHA Workers/PHC Staff) ---
@router.post("/{phc_id}/upload-inventory-photo")
async def upload_inventory_photo(phc_id: UUID, file: UploadFile = File(...)):
    """
    Uses Gemini Vision to parse a photo of a medicine shelf.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    contents = await file.read()
    
    # Gemini Vision processing
    detected_items = await vision_service.analyze_shelf_photo(contents)
    
    return {
        "phc_id": phc_id,
        "processed_at": datetime.utcnow(),
        "detected_inventory": detected_items,
        "source": "vision_ai",
        "status": "pending_verification"
    }

# Preset coordinates for known Nagpur PHCs
NAGPUR_PHC_COORDINATES = {
    "kalmeshwar": (21.23, 79.02),
    "hingna": (21.11, 79.01),
    "kamptee": (21.22, 79.20),
    "umred": (20.85, 79.33),
    "katol": (21.27, 78.59),
    "ramtek": (21.39, 79.33)
}

def get_column_value(row, possible_keys, default=0.0):
    for key in possible_keys:
        for col_name in row.index:
            col_lower = str(col_name).strip().lower()
            key_lower = str(key).strip().lower()
            if col_lower == key_lower or col_lower.startswith(key_lower) or key_lower.startswith(col_lower):
                val = row[col_name]
                try:
                    return float(val)
                except (ValueError, TypeError):
                    pass
    return default

def get_string_value(row, possible_keys, default=""):
    for key in possible_keys:
        for col_name in row.index:
            col_lower = str(col_name).strip().lower()
            key_lower = str(key).strip().lower()
            if col_lower == key_lower or col_lower.startswith(key_lower) or key_lower.startswith(col_lower):
                return str(row[col_name]).strip()
    return default

# --- MODE 2: CSV/EXCEL UPLOAD (For District Health Officers) ---
@router.post("/upload-district-report")
async def upload_district_report(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    phc_data = {}
    for _, row in df.iterrows():
        # Retrieve columns case-insensitively with support for partial/truncated matches
        name = get_string_value(row, ['phc_name', 'name', 'phc'], "").strip()
        if not name:
            continue
            
        current_stock = float(get_column_value(row, ['current_stock', 'stock', 'stock_level'], 0.0))
        min_threshold = float(get_column_value(row, ['min_threshold', 'threshold', 'min_stock'], 0.0))
        
        # Calculate risk score (clamped between 0 and 100)
        row_risk = 0
        if min_threshold > 0:
            row_risk = max(0, min(100, 100 - int((current_stock / min_threshold) * 100)))
            
        # Inventory status: critical if under safety threshold, warning if close (within 20%), stable otherwise
        status = 'critical' if current_stock < min_threshold else 'stable'
        if status == 'stable' and min_threshold > 0 and current_stock < (min_threshold * 1.2):
            status = 'warning'
            
        if name not in phc_data:
            # Resolve coordinates using preset table or falling back to CSV values
            normalized_name = name.replace("PHC", "").replace("phc", "").strip().lower()
            coords = NAGPUR_PHC_COORDINATES.get(normalized_name)
            if coords:
                lat, lng = coords
            else:
                lat = get_column_value(row, ['latitude', 'lat'], 21.14)
                lng = get_column_value(row, ['longitude', 'lng', 'lon'], 79.08)
                # If using default, add a tiny jitter to prevent exact overlapping markers
                if lat == 21.14 and lng == 79.08:
                    import random
                    lat += random.uniform(-0.04, 0.04)
                    lng += random.uniform(-0.04, 0.04)
            
            phc_data[name] = {
                "latitude": lat,
                "longitude": lng,
                "risk_score": row_risk,
                "inventory_status": status
            }
        else:
            # Aggregate: Max risk score and worst status priority (critical > warning > stable)
            if row_risk > phc_data[name]["risk_score"]:
                phc_data[name]["risk_score"] = row_risk
                
            curr_status = phc_data[name]["inventory_status"]
            if status == 'critical' or curr_status == 'critical':
                phc_data[name]["inventory_status"] = 'critical'
            elif status == 'warning' or curr_status == 'warning':
                phc_data[name]["inventory_status"] = 'warning'
            else:
                phc_data[name]["inventory_status"] = 'stable'

    parsed_phcs = []
    for name, data in phc_data.items():
        parsed_phcs.append({
            "id": str(uuid4()),
            "name": name,
            "latitude": data["latitude"],
            "longitude": data["longitude"],
            "risk_score": data["risk_score"],
            "inventory_status": data["inventory_status"]
        })

    # Parse detailed individual inventory items for listing
    inventory_items = []
    for _, row in df.iterrows():
        name = get_string_value(row, ['phc_name', 'name', 'phc'], "").strip()
        if not name:
            continue
        medicine = get_string_value(row, ['medicine', 'item'], "Unknown")
        current_stock = int(get_column_value(row, ['current_stock', 'stock', 'current_stoc'], 0.0))
        min_threshold = int(get_column_value(row, ['min_threshold', 'threshold', 'min_threshol'], 0.0))
        
        status = 'critical' if current_stock < min_threshold else 'stable'
        if status == 'stable' and min_threshold > 0 and current_stock < (min_threshold * 1.2):
            status = 'warning'
            
        inventory_items.append({
            "id": str(uuid4()),
            "phc_name": name,
            "medicine": medicine,
            "current_stock": current_stock,
            "min_threshold": min_threshold,
            "status": status
        })

    # AI Reasoning
    analysis_result = await reasoning_engine.analyze_inventory_and_redistribute(df.to_string())
    
    # Inject unique IDs into the redistribution recommendations for tracking
    if analysis_result and "redistributions" in analysis_result:
        for order in analysis_result["redistributions"]:
            if "id" not in order:
                order["id"] = str(uuid4())
                
    # Calculate district oxygen level dynamically from CSV if oxygen data is present,
    # otherwise fallback to a health score-correlated value.
    oxygen_level = 94
    # Scan all string fields/columns in rows for oxygen mentions
    oxygen_mask = df.apply(lambda r: any('oxygen' in str(v).lower() or 'o2' in str(v).lower() for v in r), axis=1)
    oxygen_rows = df[oxygen_mask]
    if not oxygen_rows.empty:
        percentages = []
        for _, row in oxygen_rows.iterrows():
            curr = float(get_column_value(row, ['current_stock', 'stock', 'current_stoc'], 0.0))
            thresh = float(get_column_value(row, ['min_threshold', 'threshold', 'min_threshol'], 100.0))
            if thresh > 0:
                percentages.append(min(100.0, (curr / thresh) * 100.0))
        if percentages:
            oxygen_level = int(sum(percentages) / len(percentages))
    else:
        health_score = analysis_result.get("district_health_score", 90) if analysis_result else 90
        oxygen_level = min(98, max(82, 85 + (health_score // 10)))
        
    if analysis_result:
        analysis_result["district_oxygen_level"] = oxygen_level
    
    return {
        "phcs": parsed_phcs,
        "inventory": inventory_items,
        "analysis": analysis_result
    }

# --- MODE 3: APPROVE TRANSFER ORDER ---
@router.post("/transfer/{transfer_id}/approve")
async def approve_transfer(transfer_id: str):
    """
    Simulates executing and finalizing a stock redistribution.
    """
    return {
        "status": "success",
        "transfer_id": transfer_id,
        "timestamp": datetime.utcnow(),
        "message": f"Transfer {transfer_id} successfully approved and dispatched."
    }