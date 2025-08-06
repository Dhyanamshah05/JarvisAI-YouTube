#!/usr/bin/env python3
"""
JARVIS AI Assistant Demo
A simplified demo to showcase core features without requiring all system dependencies
"""

from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import sqlite3
import hashlib
import json
import threading
import time
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'demo_secret_key')
CORS(app)

class JarvisDemoAI:
    def __init__(self):
        self.commands = {
            'weather': self.get_weather_demo,
            'news': self.get_news_demo,
            'time': self.get_time,
            'date': self.get_date,
            'calculate': self.calculate,
            'system': self.get_system_demo,
            'translate': self.translate_demo,
            'help': self.get_help
        }
    
    def process_command(self, command, user_id=None, language='en'):
        """Process commands with demo responses"""
        command_lower = command.lower()
        response = ""
        
        try:
            if 'weather' in command_lower:
                response = self.get_weather_demo()
            elif 'news' in command_lower:
                response = self.get_news_demo()
            elif 'time' in command_lower:
                response = self.get_time()
            elif 'date' in command_lower:
                response = self.get_date()
            elif 'calculate' in command_lower or 'math' in command_lower:
                expression = self.extract_math_expression(command)
                response = self.calculate(expression)
            elif 'system' in command_lower:
                response = self.get_system_demo()
            elif 'translate' in command_lower:
                response = self.translate_demo()
            elif 'help' in command_lower:
                response = self.get_help()
            elif 'hello' in command_lower or 'hi' in command_lower:
                response = "Hello! I'm JARVIS, your AI assistant. I'm ready to help you with various tasks."
            elif 'who are you' in command_lower:
                response = "I am JARVIS - Just A Rather Very Intelligent System. I'm an AI assistant inspired by Iron Man's AI companion."
            else:
                response = "I understand your command, but this is a demo version. Try commands like: weather, news, time, calculate 2+2, system info, or help."
            
            # Log command if user_id provided
            if user_id:
                self.log_command_demo(user_id, command, response, language)
            
            return response
            
        except Exception as e:
            return f"Demo error processing command: {str(e)}"
    
    def get_weather_demo(self):
        """Demo weather response"""
        return "🌤️ Demo Weather: It's currently 22°C with partly cloudy skies in your location. Perfect weather for working on AI projects!"
    
    def get_news_demo(self):
        """Demo news response"""
        return "📰 Demo News Headlines: 1) AI technology advances continue to reshape industries 2) Space exploration reaches new milestones 3) Renewable energy adoption accelerates globally"
    
    def get_time(self):
        """Get current time"""
        return f"🕐 The current time is {datetime.now().strftime('%H:%M:%S')}"
    
    def get_date(self):
        """Get current date"""
        return f"📅 Today is {datetime.now().strftime('%A, %B %d, %Y')}"
    
    def calculate(self, expression):
        """Perform mathematical calculations"""
        try:
            # Basic safety check
            allowed_chars = set('0123456789+-*/.() ')
            if not all(c in allowed_chars for c in expression):
                return "Invalid mathematical expression."
            
            result = eval(expression)
            return f"🧮 Calculation result: {expression} = {result}"
        except:
            return "I couldn't calculate that expression. Please check the syntax."
    
    def get_system_demo(self):
        """Demo system information"""
        return "💻 Demo System Info: CPU: 45%, Memory: 60%, Disk: 35% - All systems operating normally!"
    
    def translate_demo(self):
        """Demo translation"""
        return "🌍 Demo Translation: 'Hello' in different languages - Spanish: Hola, French: Bonjour, German: Hallo, Japanese: こんにちは"
    
    def get_help(self):
        """Help information"""
        return """🤖 JARVIS Help - Available Commands:
        
• 'hello' or 'hi' - Greet JARVIS
• 'what time is it' - Get current time
• 'what's the date' - Get current date
• 'weather' - Get weather info (demo)
• 'news' - Get latest news (demo)
• 'calculate 2+2' - Perform math calculations
• 'system info' - Get system information (demo)
• 'translate' - See translation demo
• 'who are you' - Learn about JARVIS
• 'help' - Show this help message

This is a demo version. The full version includes voice recognition, desktop automation, email scheduling, and much more!"""
    
    def extract_math_expression(self, command):
        """Extract mathematical expression from command"""
        import re
        # Look for mathematical expressions
        expression = re.search(r'[\d\+\-\*\/\.\(\)\s]+', command)
        if expression:
            return expression.group().strip()
        
        # Common math phrases
        if 'plus' in command or 'add' in command:
            return '2+2'  # Default example
        elif 'minus' in command or 'subtract' in command:
            return '10-3'
        elif 'times' in command or 'multiply' in command:
            return '5*6'
        elif 'divide' in command:
            return '20/4'
        else:
            return '2+2'  # Default calculation
    
    def log_command_demo(self, user_id, command, response, language):
        """Demo command logging"""
        print(f"[LOG] User {user_id}: {command} -> {response[:50]}...")

# Initialize demo JARVIS
jarvis_demo = JarvisDemoAI()

# Simple in-memory user storage for demo
demo_users = {'demo': {'password': 'demo', 'id': 1}}
demo_history = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username in demo_users and demo_users[username]['password'] == password:
        session['user_id'] = demo_users[username]['id']
        return jsonify({'success': True, 'user_id': demo_users[username]['id']})
    else:
        return jsonify({'error': 'Demo login: use username="demo" and password="demo"'}), 401

@app.route('/register', methods=['POST'])
def register():
    return jsonify({'error': 'Registration disabled in demo. Use demo/demo to login.'}), 400

@app.route('/process_command', methods=['POST'])
def process_command():
    data = request.get_json()
    command = data.get('command')
    language = data.get('language', 'en')
    user_id = session.get('user_id')
    
    if not command:
        return jsonify({'error': 'Command required'}), 400
    
    response = jarvis_demo.process_command(command, user_id, language)
    
    # Add to demo history
    demo_history.insert(0, {
        'command': command,
        'response': response,
        'language': language,
        'timestamp': datetime.now().isoformat()
    })
    
    # Keep only last 20 items
    if len(demo_history) > 20:
        demo_history.pop()
    
    return jsonify({
        'response': response,
        'language': language,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/voice_recognition', methods=['POST'])
def voice_recognition():
    return jsonify({
        'error': 'Voice recognition requires additional dependencies. This is demo mode.',
        'suggestion': 'Try typing commands instead!'
    }), 501

@app.route('/speak', methods=['POST'])
def speak():
    return jsonify({
        'error': 'Text-to-speech requires additional dependencies. This is demo mode.',
        'suggestion': 'Responses are displayed in text form!'
    }), 501

@app.route('/history')
def get_history():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Please login first (demo/demo)'}), 401
    
    return jsonify(demo_history)

@app.route('/logout')
def logout():
    session.clear()
    return jsonify({'success': True})

if __name__ == '__main__':
    print("🤖 Starting JARVIS AI Assistant Demo")
    print("=" * 50)
    print("🔗 Open your browser to: http://localhost:5000")
    print("👤 Demo login credentials:")
    print("   Username: demo")
    print("   Password: demo")
    print("\n💡 Try these commands:")
    print("   - hello")
    print("   - what time is it")
    print("   - calculate 15 * 24")
    print("   - weather")
    print("   - help")
    print("\n⚠️  Note: This is a demo version without full dependencies")
    print("   For the complete experience with voice recognition,")
    print("   desktop automation, and more, run the full setup.")
    
    app.run(host='0.0.0.0', port=5000, debug=True)