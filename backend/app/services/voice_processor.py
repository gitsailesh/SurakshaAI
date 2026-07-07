from google import genai
from google.genai import types
import json
from app.core.config import settings

class VoiceActionEngine:
    def __init__(self):
        if settings.ENVIRONMENT == "production":
            self.client = genai.Client(
                vertexai=True,
                project=settings.PROJECT_ID,
                location="asia-south1"
            )
        else:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = "gemini-2.5-flash"

    async def extract_medical_intent(self, transcript: str, user_context: dict):
        """
        Input: "Sir, yahan PHC-Karad mein paracetamol khatam ho raha hai, bas 10 boxes bache hain."
        Output: Structured Update for Firestore.
        """
        prompt = f"""
        Role: Medical Data Clerk.
        Context: {user_context}
        User Speech: "{transcript}"

        Task: Extract inventory updates or emergency alerts from the speech. 
        Identify:
        1. Action (UPDATE_STOCK, EMERGENCY_ALERT, STAFF_ABSENCE)
        2. Item Name
        3. Quantity mentioned
        4. Priority

        Return ONLY JSON:
        {{
          "action": "string",
          "details": {{ "item": "string", "value": int }},
          "urgency": "HIGH" | "MEDIUM" | "LOW",
          "reasoning": "string"
        }}
        """
        response = self.client.models.generate_content(
            model=self.model_id,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        return json.loads(response.text)