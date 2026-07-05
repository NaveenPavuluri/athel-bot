[README.md](https://github.com/user-attachments/files/29677720/README.md)

# Aethel Bot - AI Chat Assistant

A modern, responsive AI chat assistant powered by Google's Gemini API and built with a Flask backend. Aethel Bot provides a conversational interface capable of answering questions, writing code, and assisting with various tasks.

## Features

- **Google Gemini API Integration**: Uses the `gemini-flash-latest` model for fast and intelligent conversational responses.
- **Modern UI/UX**: A clean, responsive interface featuring a sidebar, message history placeholders, and suggestion cards.
- **Markdown & Syntax Highlighting**: Automatically parses markdown in the AI's responses and highlights code snippets using `marked.js` and `highlight.js`.
- **Typing Indicators & Auto-scrolling**: Provides a smooth user experience with visual feedback while the AI is generating a response.
- **Mobile Responsive**: Includes a mobile-friendly layout with a toggleable sidebar menu.

## Tech Stack

- **Backend**: Python, Flask, Google Generative AI SDK
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Libraries/Assets**: FontAwesome (Icons), Google Fonts (Outfit), Marked.js, Highlight.js

## Project Structure

```text
.
├── app.py                 # Main Flask application and API routes
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (API Key)
├── static/
│   ├── script.js          # Frontend logic and API calls
│   └── style.css          # UI styling
└── templates/
    └── index.html         # Main application layout
```

## Setup & Installation

### 1. Clone or Download the Repository
Ensure you have all the project files in your local directory.

### 2. Install Dependencies
Make sure you have Python installed. Then, install the required packages:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (if not already present) and add your Google Gemini API Key:

```env
GEMINI_API_KEY="your_api_key_here"
```

### 4. Run the Application
Start the Flask development server:

```bash
python app.py
```

### 5. Access the App
Open your web browser and navigate to:
`http://localhost:5000`

## Usage

- Type your message in the input field at the bottom and press **Enter** (or click the send button).
- Use **Shift + Enter** to add a new line without sending the message.
- Click on any of the suggestion cards on the welcome screen to quickly start a conversation.

## Disclaimer
Aethel Bot uses generative AI and can make mistakes. Please consider verifying important information.
