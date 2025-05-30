from langdetect import detect
from googletrans import Translator
import re
import json
from typing import Dict, Tuple, Optional

class DataProcessor:
    def __init__(self):
        self.translator = Translator()
        self.language_codes = {
            'en': 'English',
            'fr': 'French',
            'ar': 'Arabic'
        }
        
    def detect_language(self, text: str) -> str:
        """
        Detect the language of the input text.
        Returns the language code (en, fr, ar).
        """
        try:
            lang = detect(text)
            # Map detected language to our supported languages
            if lang in ['ar', 'fr', 'en']:
                return lang
            return 'en'  # Default to English if not supported
        except:
            return 'en'

    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translate text from source language to target language.
        """
        if source_lang == target_lang:
            return text
            
        try:
            translation = self.translator.translate(
                text,
                src=source_lang,
                dest=target_lang
            )
            return translation.text
        except Exception as e:
            print(f"Translation error: {str(e)}")
            return text

    def normalize_text(self, text: str) -> str:
        """
        Normalize text by removing extra spaces and special characters.
        """
        # Remove extra spaces
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters except punctuation
        text = re.sub(r'[^a-zA-Z0-9\s.,!?]', '', text)
        return text.strip()

    def process_message(self, message: str, target_lang: str = 'en') -> Dict:
        """
        Process a message by detecting language and translating if needed.
        Returns a dictionary with processed information.
        """
        # Detect language
        detected_lang = self.detect_language(message)
        
        # Normalize text
        normalized_text = self.normalize_text(message)
        
        # Translate if needed
        translated_text = self.translate_text(
            normalized_text,
            detected_lang,
            target_lang
        )
        
        return {
            'original_text': message,
            'detected_language': detected_lang,
            'normalized_text': normalized_text,
            'translated_text': translated_text,
            'target_language': target_lang
        }

    def format_response(self, response: str, target_lang: str) -> str:
        """
        Format the response according to the target language.
        """
        # Add language-specific formatting
        if target_lang == 'ar':
            # Add RTL formatting for Arabic
            return f'<div dir="rtl">{response}</div>'
        return response

    def validate_input(self, text: str) -> Tuple[bool, Optional[str]]:
        """
        Validate input text for security and content.
        Returns (is_valid, error_message).
        """
        if not text or len(text.strip()) == 0:
            return False, "Empty message"
            
        if len(text) > 1000:  # Maximum message length
            return False, "Message too long"
            
        # Add more validation rules as needed
        
        return True, None

    def save_conversation(self, user_message: str, bot_response: str, 
                         detected_lang: str, target_lang: str) -> None:
        """
        Save conversation data for analysis and improvement.
        """
        conversation_data = {
            'timestamp': str(datetime.now()),
            'user_message': user_message,
            'bot_response': bot_response,
            'detected_language': detected_lang,
            'target_language': target_lang
        }
        
        # Save to file or database
        with open('conversation_history.json', 'a', encoding='utf-8') as f:
            json.dump(conversation_data, f, ensure_ascii=False)
            f.write('\n') 