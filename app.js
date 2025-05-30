let currentChatAbortController = null;

function isArabic(text) {
    // Arabic Unicode range: \u0600-\u06FF
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
}

function findAndReverseEmail(sectionBody) {
    console.log("Input text:", sectionBody);

    // Regular expression to match email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    // Find all emails in the section body
    const emails = sectionBody.match(emailRegex);
    console.log("Found emails:", emails);

    if (!emails) {
        console.log("No emails found, returning original text");
        return sectionBody;
    }

    // Replace each email with its reversed version
    let result = sectionBody;
    emails.forEach(email => {
        console.log("Processing email:", email);
        
        // Reverse the entire email
        const reversedEmail = email.split('').reverse().join('');
        console.log("Reversed email:", reversedEmail);
        
        // Replace the original email with reversed email
        result = result.replace(email, reversedEmail);
        console.log("Current result:", result);
    });

    console.log("Final result:", result);
    return result;
}

function reverseBrackets(text) {
    console.log("Input text:", text);
    
    // Define bracket pairs
    const bracketPairs = {
        '(': ')',
        ')': '(',
        '<': '>',
        '>': '<',
        '{': '}',
        '}': '{',
        '[': ']',
        ']': '['
    };
    
    // Create a stack to track bracket positions
    const stack = [];
    let result = text.split('');
    
    // First pass: find all brackets and their positions
    for (let i = 0; i < result.length; i++) {
        const char = result[i];
        if (Object.keys(bracketPairs).includes(char)) {
            stack.push({ char, position: i });
        }
    }
    
    // Second pass: reverse brackets
    for (let i = 0; i < stack.length; i++) {
        const { char, position } = stack[i];
        result[position] = bracketPairs[char];
    }
    
    const finalResult = result.join('');
    console.log("Final result:", finalResult);
    return finalResult;
}

function createSectionsCopy(sections) {
    // Method 1: Using JSON (handles most cases)
    try {
        return JSON.parse(JSON.stringify(sections));
    } catch (error) {
        console.error("JSON method failed, trying alternative method");
        
        // Method 2: Manual deep copy
        if (Array.isArray(sections)) {
            return sections.map(item => createSectionsCopy(item));
        } else if (sections && typeof sections === 'object') {
            const copy = {};
            for (const key in sections) {
                if (sections.hasOwnProperty(key)) {
                    copy[key] = createSectionsCopy(sections[key]);
                }
            }
            return copy;
        } else {
            return sections;
        }
    }
}

// Example usage
const originalSections = {
    section1: {
        title: "First Section",
        content: "Some content",
        subsections: [
            { name: "Sub 1", value: "Value 1" },
            { name: "Sub 2", value: "Value 2" }
        ]
    },
    section2: {
        title: "Second Section",
        content: "More content"
    }
};

console.log("Original sections:", originalSections);
const copiedSections = createSectionsCopy(originalSections);
console.log("Copied sections:", copiedSections);

// Example usage with mixed Arabic and English text containing emails
const paragraphs = [
    "مرحبا! Contact: john.doe@example.com",
    "مرحبا بالعالم Support: support.team@company.com",
    "هذا النص لا يحتوي على بريد إلكتروني",
    "Multiple emails: first.name@domain.com and second.name@domain.com مرحبا"
];

// Process each paragraph
const processedParagraphs = paragraphs.map(paragraph => findAndReverseEmail(paragraph));

console.log("Original paragraphs:", paragraphs);
console.log("Processed paragraphs:", processedParagraphs);

// Example usage:
const text = "مرحبا"; // Hello in Arabic
if (isArabic(text)) {
    console.log("The text contains Arabic characters");
} else {
    console.log("The text does not contain Arabic characters");
}

const sectionName = "Contact Information";
const sectionBody = `
    Name: John Doe
    Email: john.doe@example.com
    Phone: 123-456-7890
`;

const reversedEmail = findAndReverseEmail(sectionBody);
console.log("Reversed email:", reversedEmail);

// Test with a specific example
const testText = "مرحبا! Contact: john.doe@example.com";
console.log("\nTesting with:", testText);
const result = findAndReverseEmail(testText);
console.log("Final output:", result);

// Test with specific examples
const testText2 = "مرحبا! Contact: ab@cd.com";
console.log("\nTesting with:", testText2);
const result2 = findAndReverseEmail(testText2);
console.log("Final output:", result2);

// Test bracket reversal
const bracketTest = "Hello (world) with [brackets] and {curly} <tags>";
console.log("\nTesting bracket reversal with:", bracketTest);
const bracketResult = reverseBrackets(bracketTest);
console.log("Bracket reversal output:", bracketResult);

const drawHeader = () => {
    if (isArabic) {
        // For Arabic: text on left, image on right
        doc.setFont(fontFamillyForTittles)
            .setFontSize(11)
            .text(positionText, margin.left, 45, {
                isInputVisual: true,
                isOutputVisual: true,
                isInputRtl: false,
                isOutputRtl: true
            });
        
        doc.addImage(img, 'PNG', pageWidth - margin.right - 80, 20, 80, imgHeight);
    } else {
        // For non-Arabic: image on left, text on right
        doc.addImage(img, 'PNG', margin.left, 20, 80, imgHeight);
        
        doc.setFont(fontFamillyForTittles)
            .setFontSize(11)
            .text(positionText, pageWidth - margin.right - doc.getTextWidth(positionText), 45);
    }
    cursorY = margin.top;
};

function addPendingBotMessage() {
    console.log("Adding pending message");
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message pending-message';
    messageDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

function typeWriterEffect(element, text, speed = 30, lineByLine = false) {
    element.textContent = '';
    let lines = lineByLine ? text.split('\n') : [text];
    let lineIndex = 0;
    let charIndex = 0;

    function typeLine() {
        if (lineIndex >= lines.length) return;
        let line = lines[lineIndex];
        let current = '';
        let interval = setInterval(() => {
            current += line[charIndex];
            element.textContent = element.textContent.replace(/\s*$/, '') + line[charIndex];
            charIndex++;
            if (charIndex >= line.length) {
                clearInterval(interval);
                element.textContent += '\n';
                lineIndex++;
                charIndex = 0;
                setTimeout(typeLine, 200); // Pause between lines
            }
        }, speed);
    }
    typeLine();
}

sendButton.onclick = async function() {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    addSidebarQuestion(text);
    userInput.value = '';

    // Add pending message (typing indicator)
    const pendingDiv = addPendingBotMessage();

    sendButton.disabled = true;

    // Abort any previous chat fetch
    if (currentChatAbortController) {
        currentChatAbortController.abort();
    }
    currentChatAbortController = new AbortController();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, language: langSelect.value }),
            signal: currentChatAbortController.signal
        });
        const data = await response.json();

        // Remove pending animation
        pendingDiv.remove();

        // Add bot message with typewriter effect
        const botDiv = document.createElement('div');
        botDiv.className = 'message bot-message';
        chatMessages.appendChild(botDiv);
        typeWriterEffect(botDiv, data.response, 20, true);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        sendButton.disabled = false;
    } catch (err) {
        if (err.name === 'AbortError') {
            // Request was aborted, do nothing
            return;
        }
        sendButton.disabled = false;
        pendingDiv.remove();
        // Only add the error message if no other bot-message is present for this turn
        const botDiv = document.createElement('div');
        botDiv.className = 'message bot-message';
        botDiv.textContent = "Sorry, there was an error. Please try again.";
        chatMessages.appendChild(botDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
};

langSelect.onchange = function () {
    // Abort any ongoing chat fetch
    if (currentChatAbortController) {
        currentChatAbortController.abort();
    }
    localStorage.setItem('selectedLang', langSelect.value);
    // ... rest of your code ...
}; 