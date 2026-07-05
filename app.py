import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)

app = Flask(__name__)

# Configure the Gemini API
API_KEY = os.environ.get("GEMINI_API_KEY")

if API_KEY and API_KEY != "your_api_key_here":
    genai.configure(api_key=API_KEY)
    # Using the standard gemini-flash-latest model for general chat
    model = genai.GenerativeModel('gemini-flash-latest')
else:
    model = None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    if not model:
        return jsonify({"error": "Gemini API key not configured. Please add it to the .env file in the project folder."}), 500
    
    data = request.json
    user_message = data.get("message")
    
    if not user_message:
        return jsonify({"error": "Message is required."}), 400
        
    try:
        response = model.generate_content(user_message)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000) 
