from fastapi import APIRouter
from app.services.reasoning_engine import StrategicReasoningEngine
from app.schemas.domain import AnalysisResponse
from uuid import UUID
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter()
ai_engine = StrategicReasoningEngine()

class TranslationRequest(BaseModel):
    text: str
    target_lang: str  # "hi" or "mr"

@router.get("/district/{district_id}", response_model=AnalysisResponse)
async def perform_district_analysis(district_id: UUID):
    # Construct a synthetic district dataset to run the strategic optimization
    csv_data = """phc_name,current_stock,min_threshold,latitude,longitude
PHC Kalmeshwar,15,100,21.23,79.02
PHC Hingna,120,100,21.11,79.01
PHC Kamptee,5,100,21.22,79.20
PHC Umred,80,100,20.85,79.33
PHC Katol,25,100,21.27,78.59
PHC Ramtek,150,100,21.39,79.33
"""
    
    # Gemini performs the 'Real Reasoning'
    analysis_result = await ai_engine.analyze_inventory_and_redistribute(csv_data)
    
    return analysis_result

@router.post("/translate")
async def translate_text(request: TranslationRequest):
    """
    Translates the medical briefing text to Hindi or Marathi using Google Cloud Translation,
    falling back to Gemini translation on failure.
    """
    try:
        from google.cloud import translate
        client = translate.TranslationServiceClient()
        parent = f"projects/{settings.PROJECT_ID}/locations/global"
        
        response = client.translate_text(
            request={
                "parent": parent,
                "contents": [request.text],
                "mime_type": "text/plain",
                "target_language_code": request.target_lang,
            }
        )
        translated = response.translations[0].translated_text
        return {"translated_text": translated.strip()}
    except Exception as gcloud_err:
        print(f"Google Cloud Translation failed ({gcloud_err}), falling back to Gemini...")
        
        lang_map = {
            "hi": "Hindi",
            "mr": "Marathi"
        }
        target_lang_name = lang_map.get(request.target_lang, "Hindi")
        
        prompt = f"""
        Translate the following health and medical inventory briefing text into clear, professional, and natural {target_lang_name}. 
        Use the Devanagari script for the translation output.
        Provide ONLY the translation itself. Do not include any explanations, prefaces, or formatting code.
        
        Text to translate:
        {request.text}
        """
        
        try:
            response = ai_engine.client.models.generate_content(
                model=ai_engine.model_id,
                contents=prompt
            )
            return {"translated_text": response.text.strip()}
        except Exception as gemini_err:
            print(f"Gemini Translation Fallback Error: {gemini_err}")
            return {"translated_text": request.text}