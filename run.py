import os
from app import app

if __name__ == '__main__':
    # Create necessary directories if they don't exist
    os.makedirs('conversation_history', exist_ok=True)
    
    # Run the Flask application
    app.run(debug=True, host='0.0.0.0', port=5000) 