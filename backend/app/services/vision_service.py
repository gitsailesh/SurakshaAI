from google import genai
from google.genai import types
from PIL import Image
import io
import json
from app.core.config import settings

class InventoryVisionService:
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

    async def analyze_shelf_photo(self, image_bytes: bytes):
        """
        Processes an image of a medicine shelf and returns structured stock data.
        """
        img = Image.open(io.BytesIO(image_bytes))
        
        prompt = """
        Analyze this image of a medical inventory shelf/ledger. 
        1. Identify all visible medicines (e.g., Paracetamol, Insulin, Amoxicillin).
        2. Estimate the quantity based on box counts or visible units.
        3. Identify any medicines near expiry or damaged packaging.
        4. Detect handwritten stock numbers if a ledger is present.

        Return ONLY a JSON array of objects:
        [
          {
            "item_name": "string",
            "detected_quantity": integer,
            "confidence": float (0-1),
            "condition": "good" | "near_expiry" | "damaged",
            "visual_evidence": "short description of what was seen"
          }
        ]
        """
        
        response = self.client.models.generate_content(
            model=self.model_id,
            contents=[prompt, img],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        return json.loads(response.text)