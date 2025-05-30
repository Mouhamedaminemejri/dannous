document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const languageSelect = document.getElementById('language-select');
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');

    function renderSuggestedQuestions(suggestedQuestionsArr) {
        const sidebarSuggested = document.getElementById('sidebar-suggested');
        sidebarSuggested.innerHTML = '';
        (suggestedQuestionsArr || []).forEach(q => {
            const qDiv = document.createElement('div');
            qDiv.className = 'sidebar-suggested-question';
            qDiv.textContent = q;
            qDiv.onclick = function() {
                userInput.value = q;
                sendButton.click();
            };
            sidebarSuggested.appendChild(qDiv);
        });
    }

    // Fetch translations for the current language on page load
    fetch('/translations')
        .then(response => response.json())
        .then(data => {
            // Update static text
            document.querySelector('.chat-title').textContent = data.title;
            document.querySelectorAll('.sidebar-header')[0].textContent = data.previous_questions;
            document.querySelectorAll('.sidebar-header')[1].textContent = data.suggested_questions;
            document.getElementById('send-button').textContent = data.send;
            document.getElementById('user-input').placeholder = data.placeholder;
            languageSelect.options[0].text = data.english;
            languageSelect.options[1].text = data.french;
            languageSelect.options[2].text = data.arabic;
            const suggestedQuestions = [
                data.suggested_1 || "I want assistan cecanceling a loan",
                data.suggested_2 || "id like to activate a visa online",
                data.suggested_3 || "How can I get a loan?"
            ];
            renderSuggestedQuestions(suggestedQuestions);
        })
        .catch(err => {
            console.error('Error fetching translations:', err);
        });

    // Add initial bot message
    addMessage('Hello! I am your banking assistant. How can I help you today?', 'bot');

    // Handle send button click
    sendButton.addEventListener('click', sendMessage);

    // Handle enter key press
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle quick action buttons
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            userInput.value = this.textContent;
            sendMessage();
        });
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message to chat
            addMessage(message, 'user');
            
            // Clear input
            userInput.value = '';

            // Show loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message bot-message';
            loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Send message to server
            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    language: languageSelect.value
                })
            })
            .then(response => response.json())
            .then(data => {
                // Remove loading indicator
                chatMessages.removeChild(loadingDiv);
                
                if (data.error) {
                    addMessage('Sorry, there was an error processing your request.', 'bot');
                } else {
                    addMessage(data.response, 'bot');
                }
            })
            .catch(error => {
                // Remove loading indicator
                chatMessages.removeChild(loadingDiv);
                addMessage('Sorry, there was an error connecting to the server.', 'bot');
            });
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    languageSelect.onchange = function() {
        fetch('/set_language', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lang: languageSelect.value })
        }).then(() => {
            setTimeout(() => {
                fetch('/translations')
                    .then(response => response.json())
                    .then(data => {
                        // Update static text as before
                        document.querySelector('.chat-title').textContent = data.title;
                        document.querySelectorAll('.sidebar-header')[0].textContent = data.previous_questions;
                        document.querySelectorAll('.sidebar-header')[1].textContent = data.suggested_questions;
                        document.getElementById('send-button').textContent = data.send;
                        document.getElementById('user-input').placeholder = data.placeholder;
                        languageSelect.options[0].text = data.english;
                        languageSelect.options[1].text = data.french;
                        languageSelect.options[2].text = data.arabic;
                        // Update suggested questions
                        renderSuggestedQuestions([
                            data.suggested_1,
                            data.suggested_2,
                            data.suggested_3
                        ]);
                    });
            }, 100); // 100ms delay
        });
    };
}); 