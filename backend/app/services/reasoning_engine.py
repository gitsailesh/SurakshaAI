import json
from typing import Dict
from google import genai
from google.genai import types
from app.core.config import settings

class StrategicReasoningEngine:
    def __init__(self):
      try:

        if settings.ENVIRONMENT == "production":
            # PROD: Vertex AI (Uses Cloud Run Service Account)
            self.client = genai.Client(
                vertexai=True,
                project=settings.PROJECT_ID,
                location="asia-south1" # Mumbai region for India-based data
            )
        else:
            # DEV: Google AI Studio (Uses your API Key)
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

        # 1.5 Pro remains the best for complex constraint satisfaction
        self.model_id = "gemini-2.5-flash" 
      except Exception as e:
        print(f"❌ AI Client Init Error: {e}")
        raise e
    
    async def analyze_inventory_and_redistribute(self, csv_data: str):
        """
        Receives raw CSV data from the Nagpur PHC network and 
        performs multi-vector optimization using the modern GenAI SDK.
        """
        
        prompt = f"""
        Role: Chief Resource Optimizer for Nagpur District Health Administration.
        Objective: Minimize mortality and eliminate stock-out duration across the district.

        Context Data (Nagpur PHC Network Snapshot):
        {csv_data}

        Strategic Constraints & Logic:
        1. PRIORITIZATION: Prioritize Life-Saving drugs (Insulin, Oxygen, Anti-venom) over general EDL (Essential Drug List).
        2. THRESHOLD RULE: Only suggest moving stock from a 'Source' PHC if it has >20% surplus above its safety stock.
        3. GEOGRAPHY: Nagpur district geography must be considered. Group PHCs in clusters (e.g., Kalmeshwar, Hingna, Kamptee) to minimize transport time.
        4. OUTBREAK LOGIC: If the data shows a spike in specific symptoms, prioritize diagnostic kits and specific antibiotics for that region.

        Output Requirements (Strict JSON Format):
        {{
          "executive_summary": "string",
          "at_risk_phcs": [{{ "name": "string", "reason": "string", "urgency": "CRITICAL" | "HIGH" }}],
          "redistributions": [
            {{
              "from_phc": "string",
              "to_phc": "string",
              "item": "string",
              "quantity": int,
              "urgency": "CRITICAL" | "HIGH" | "MEDIUM",
              "reasoning": "string",
              "impact_score": "string"
            }}
          ],
          "district_health_score": int
        }}
        """

        try:
            # New SDK syntax for generation
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    response_mime_type="application/json",
                )
            )
            
            # The new SDK returns response.text directly
            return json.loads(response.text)
            
        except Exception as e:
            print(f"AI Reasoning Error: {str(e)}")
            return {
                "executive_summary": "Error processing district intelligence. Please check data format.",
                "at_risk_phcs": [],
                "redistributions": [],
                "district_health_score": 0
            }