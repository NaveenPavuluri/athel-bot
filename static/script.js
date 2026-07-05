document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesWrapper = document.getElementById('messages-wrapper');
    const welcomeScreen = document.getElementById('welcome-screen');
    const typingIndicator = document.getElementById('typing-indicator');
    const chatContainer = document.getElementById('chat-container');
    
    // Mobile sidebar toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Configure marked.js with highlight.js
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true
    });

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Enable/disable send button
        if (this.value.trim().length > 0) {
            sendBtn.removeAttribute('disabled');
        } else {
            sendBtn.setAttribute('disabled', 'true');
        }
    });

    // Handle enter key to send (Shift+Enter for new line)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim().length > 0) {
                chatForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Make setInputAndSend available globally for suggestion cards
    window.setInputAndSend = function(text) {
        userInput.value = text;
        sendBtn.removeAttribute('disabled');
        chatForm.dispatchEvent(new Event('submit'));
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const messageText = userInput.value.trim();
        if (!messageText) return;

        // Hide welcome screen
        if (welcomeScreen.style.display !== 'none') {
            welcomeScreen.style.display = 'none';
        }

        // Add user message to UI
        appendMessage(messageText, 'user');

        // Reset input
        userInput.value = '';
        userInput.style.height = 'auto';
        sendBtn.setAttribute('disabled', 'true');

        // Show typing indicator
        typingIndicator.style.display = 'block';
        scrollToBottom();

        try {
            // Send to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            const data = await response.json();

            // Hide typing indicator
            typingIndicator.style.display = 'none';

            if (response.ok) {
                // Add AI message to UI (parse markdown)
                appendMessage(data.response, 'ai');
            } else {
                // Handle error
                appendMessage(`<div class="error-message"><i class="fa-solid fa-triangle-exclamation"></i> ${data.error || 'An error occurred'}</div>`, 'ai', true);
            }
        } catch (error) {
            typingIndicator.style.display = 'none';
            appendMessage(`<div class="error-message"><i class="fa-solid fa-triangle-exclamation"></i> Failed to connect to server. Ensure the backend is running.</div>`, 'ai', true);
            console.error('Error:', error);
        }
    });

    function appendMessage(content, sender, isRawHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const icon = sender === 'user' ? 'fa-user' : 'fa-robot';
        
        // Parse markdown if it's an AI message and not raw HTML error
        let parsedContent = content;
        if (sender === 'ai' && !isRawHtml) {
            parsedContent = marked.parse(content);
        } else if (sender === 'user') {
            // Escape HTML for user messages to prevent XSS
            parsedContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        messageDiv.innerHTML = `
            <div class="avatar"><i class="fa-solid ${icon}"></i></div>
            <div class="message-content">${parsedContent}</div>
        `;
        
        messagesWrapper.appendChild(messageDiv);
        
        // Apply syntax highlighting to new code blocks
        if (sender === 'ai' && !isRawHtml) {
            messageDiv.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

        scrollToBottom();
    }

    function scrollToBottom() {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }
});
