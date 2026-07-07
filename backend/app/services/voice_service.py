import google.cloud.speech as speech

class VoiceCommandService:
    def transcribe_and_translate(self, audio_content: bytes, source_lang: str = "hi-IN"):
        """
        Converts Hindi/Tamil/Marathi voice notes from ASHA workers into English text 
        for processing by the StrategicReasoningEngine.
        """
        client = speech.SpeechClient()
        audio = speech.RecognitionAudio(content=audio_content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            language_code=source_lang,
        )
        
        response = client.recognize(config=config, audio=audio)
        # Process transcription...
        return response.results[0].alternatives[0].transcript