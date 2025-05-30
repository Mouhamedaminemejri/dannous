from flask import Flask, render_template, request, jsonify, session
from dotenv import load_dotenv
import os
import httpx
from langdetect import detect
from deep_translator import GoogleTranslator
import json
from flask_babel import Babel, _

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['BABEL_DEFAULT_LOCALE'] = 'en'
app.config['BABEL_TRANSLATION_DIRECTORIES'] = 'translations'

babel = Babel(app)

# Banking-specific system prompts
BANKING_PROMPTS = {
    'en': "You are a helpful banking assistant. You can help with account inquiries, transactions, loans, and general banking services.",
    'fr': "Vous êtes un assistant bancaire utile. Vous pouvez aider avec les demandes de compte, les transactions, les prêts et les services bancaires généraux.",
    'ar': "أنت مساعد مصرفي مفيد. يمكنك المساعدة في استفسارات الحساب والمعاملات والقروض والخدمات المصرفية العامة."
}

# Utility: Language detection (not used in chat flow, but kept for future use)
def detect_language(text):
    try:
        return detect(text)
    except:
        return 'en'  # Default to English if detection fails

def translate_text(text, source_lang, target_lang):
    if source_lang == target_lang:
        return text
    try:
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        return translator.translate(text)
    except Exception as e:
        print(f"Translation error: {str(e)}")
        return text

def get_locale():
    print('Current session lang:', session.get('lang', 'en'))
    return session.get('lang', 'en')
babel.init_app(app, locale_selector=get_locale)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/set_language', methods=['POST'])
def set_language():
    lang = request.json.get('lang')
    session['lang'] = lang
    return {'success': True}

@app.route('/translations')
def translations():
    from flask_babel import _
    return jsonify({
        "title": _( "Dannous your Banking System Chatbot"),
        "previous_questions": _( "Previous Questions"),
        "suggested_questions": _( "Suggested Questions"),
        "send": _( "Send"),
        "placeholder": _( "Type your message here..."),
        "english": _( "English"),
        "french": _( "French"),
        "arabic": _( "Arabic"),
        "suggested_1": _( "I want assistance canceling a loan"),
        "suggested_2": _( "id like to activate a visa online"),
        "suggested_3": _( "How can I get a loan?")
    })

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json['message']
    lang = session.get('lang', 'en')

    # Translate user message to English if needed
    if lang in ['ar', 'fr']:
        user_message_en = translate_text(user_message, lang, 'en')
    else:
        user_message_en = user_message

    payload = {
        "messages": [
            {"role": "system", "content": "You are a helpful banking assistant."},
            {"role": "user", "content": user_message_en}
        ],
        "mode": "instruct",
        "stream": True
    }

    print("\n=== Sending Prompt to API ===")
    print(f"User Message (original): {user_message}")
    print(f"User Message (EN): {user_message_en}")
    print(f"Full Payload: {json.dumps(payload, indent=2)}")
    print("===========================\n")

    try:
        response = httpx.post(
            "https://b860-41-230-179-8.ngrok-free.app/v1/chat/completions",
            json=payload,
            timeout=3000
        )
        response.raise_for_status()
        data = response.json()
        model_reply_en = data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error communicating with text-generation-webui API: {e}")
        model_reply_en = "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."

    # Translate model reply back to user's language if needed
    if lang in ['ar', 'fr']:
        model_reply = translate_text(model_reply_en, 'en', lang)
    else:
        model_reply = model_reply_en

    return jsonify({
        "response": model_reply,
        "detected_language": lang
    })

def build_prompt(instruction, user_input=""):
    return f"Instruction: {instruction}\nInput: {user_input}\nResponse:"

prompt = build_prompt(
    instruction="I have to activate a Visa online, how can I do it?",
    user_input=""
)
# Send 'prompt' to your model

if __name__ == '__main__':
    app.run(debug=True, port=8000)