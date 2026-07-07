import uuid
import random
from datetime import datetime, timedelta

def generate_synthetic_data(count=100):
    phcs = []
    medicines = ["Paracetamol", "Insulin", "BCG Vaccine", "Amoxicillin", "ORS Packets", "Oxytocin"]
    
    for i in range(count):
        phc_id = uuid.uuid4()
        phc = {
            "id": str(phc_id),
            "name": f"PHC Nagpur-Zone-{i}",
            "latitude": 21.1458 + random.uniform(-0.4, 0.4),
            "longitude": 79.0882 + random.uniform(-0.4, 0.4),
            "risk_score": random.randint(10, 95),
            "inventory": [
                {
                    "id": str(uuid.uuid4()),
                    "name": med,
                    "stock": random.randint(0, 500), # Some will be 0 to trigger AI
                    "min_threshold": 100
                } for med in medicines
            ],
            "staffing": {
                "doctors": random.randint(1, 5),
                "nurses": random.randint(2, 10),
                "asha_workers": random.randint(5, 20)
            },
            "patient_load_24h": random.randint(20, 150)
        }
        phcs.append(phc)
    return phcs

# Execution logic would push this to Firestore using firebase-admin