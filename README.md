# Banking AI Chatbot

A multilingual banking chatbot supporting Tunisian Arabic, French, and English with hybrid language combinations.

## Project Phases

### Phase 1: Business Understanding, Data Requirements, Data Collection and Understanding
- Business Requirements
  - Multilingual support (Tunisian Arabic, French, English)
  - Banking-specific domain knowledge
  - Real-time customer support
  - Secure communication
  - User-friendly interface

- Data Requirements
  - Banking terminology in three languages
  - Common banking queries and responses
  - User interaction patterns
  - Language detection and translation capabilities

- Data Collection
  - Banking FAQs and responses
  - Common customer queries
  - Banking procedures and policies
  - Language-specific banking terms

### Phase 2: Data Preparation
- Data Processing
  - Language detection and translation
  - Text normalization
  - Response formatting
  - Context management

- Data Storage
  - Conversation history
  - User preferences
  - Language mappings
  - Banking knowledge base

### Phase 3: Data Modeling and Evaluation
- Model Components
  - Language detection model
  - Translation model
  - Response generation model
  - Context understanding model

- Evaluation Metrics
  - Response accuracy
  - Language detection accuracy
  - Translation quality
  - User satisfaction
  - Response time

## Project Structure
```
banking_chatbot/
├── phase1/                    # Business Understanding & Data Collection
│   ├── business_requirements/ # Business requirements documentation
│   ├── data_requirements/     # Data requirements documentation
│   └── data_collection/       # Collected data and resources
├── phase2/                    # Data Preparation
│   ├── data_processing/       # Data processing scripts
│   └── data_storage/         # Data storage implementation
├── phase3/                    # Data Modeling & Evaluation
│   ├── models/               # Model implementations
│   └── evaluation/           # Evaluation scripts and metrics
├── app/                      # Main application
│   ├── static/              # Static files (CSS, JS)
│   ├── templates/           # HTML templates
│   └── utils/               # Utility functions
├── tests/                    # Test files
├── requirements.txt          # Project dependencies
└── README.md                # Project documentation
```

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file and add your OpenAI API key:
```
OPENAI_API_KEY=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
```

4. Run the application:
```bash
python app.py
```

5. Open your browser and navigate to `http://localhost:5000`

## Features
- Interactive chat interface
- AI-powered responses
- Real-time conversation handling
- Clean and modern UI
- Multilingual support (Tunisian Arabic, French, English)
- Banking-specific domain knowledge
- Quick action buttons for common banking tasks
- Language detection and translation
- RTL support for Arabic text

## Evaluation Metrics
- Response accuracy
- Language detection accuracy
- Translation quality
- User satisfaction
- Response time
- Error rate
- User engagement metrics 