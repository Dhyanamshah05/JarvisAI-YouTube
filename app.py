from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import sqlite3
import hashlib
import speech_recognition as sr
import pyttsx3
import schedule
import time
import threading
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from langdetect import detect
from googletrans import Translator
import requests
import psutil
import pyautogui
import subprocess
import os
import json
import logging
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'jarvis_secret_key_change_in_production')
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize speech components
recognizer = sr.Recognizer()
tts_engine = pyttsx3.init()
translator = Translator()

# Database initialization
def init_database():
    conn = sqlite3.connect('jarvis.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Login history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS login_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            user_agent TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Commands history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS command_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            command TEXT,
            response TEXT,
            language TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Scheduled emails table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scheduled_emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            recipient TEXT,
            subject TEXT,
            body TEXT,
            scheduled_time TIMESTAMP,
            sent BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

class JarvisAI:
    def __init__(self):
        self.commands = {
            'weather': self.get_weather,
            'news': self.get_news,
            'time': self.get_time,
            'date': self.get_date,
            'calculate': self.calculate,
            'open': self.open_application,
            'close': self.close_application,
            'volume': self.control_volume,
            'screenshot': self.take_screenshot,
            'system': self.get_system_info,
            'translate': self.translate_text,
            'email': self.schedule_email,
            'reminder': self.set_reminder
        }
    
    def process_command(self, command, user_id=None, language='en'):
        """Process voice or text commands"""
        command_lower = command.lower()
        response = ""
        
        try:
            # Detect language if not specified
            if language == 'auto':
                language = detect(command)
            
            # Process different command types
            if 'weather' in command_lower:
                city = self.extract_city(command)
                response = self.get_weather(city)
            elif 'news' in command_lower:
                response = self.get_news()
            elif 'time' in command_lower:
                response = self.get_time()
            elif 'date' in command_lower:
                response = self.get_date()
            elif 'calculate' in command_lower or 'math' in command_lower:
                expression = self.extract_math_expression(command)
                response = self.calculate(expression)
            elif 'open' in command_lower:
                app_name = self.extract_app_name(command)
                response = self.open_application(app_name)
            elif 'close' in command_lower:
                app_name = self.extract_app_name(command)
                response = self.close_application(app_name)
            elif 'volume' in command_lower:
                level = self.extract_volume_level(command)
                response = self.control_volume(level)
            elif 'screenshot' in command_lower:
                response = self.take_screenshot()
            elif 'system' in command_lower:
                response = self.get_system_info()
            elif 'translate' in command_lower:
                text, target_lang = self.extract_translation_params(command)
                response = self.translate_text(text, target_lang)
            elif 'email' in command_lower:
                params = self.extract_email_params(command)
                response = self.schedule_email(params, user_id)
            elif 'reminder' in command_lower:
                params = self.extract_reminder_params(command)
                response = self.set_reminder(params, user_id)
            else:
                response = "I'm sorry, I didn't understand that command. Could you please rephrase?"
            
            # Log command
            if user_id:
                self.log_command(user_id, command, response, language)
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing command: {str(e)}")
            return "I encountered an error processing your command. Please try again."
    
    def get_weather(self, city="London"):
        """Get weather information"""
        try:
            api_key = os.getenv('WEATHER_API_KEY')
            if not api_key:
                return "Weather API key not configured."
            
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
            response = requests.get(url)
            data = response.json()
            
            if response.status_code == 200:
                temp = data['main']['temp']
                description = data['weather'][0]['description']
                return f"The weather in {city} is {temp}°C with {description}."
            else:
                return f"Couldn't get weather information for {city}."
        except:
            return "Weather service is currently unavailable."
    
    def get_news(self):
        """Get latest news headlines"""
        try:
            api_key = os.getenv('NEWS_API_KEY')
            if not api_key:
                return "News API key not configured."
            
            url = f"https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}"
            response = requests.get(url)
            data = response.json()
            
            if response.status_code == 200:
                headlines = [article['title'] for article in data['articles'][:3]]
                return "Here are the top news headlines: " + "; ".join(headlines)
            else:
                return "Couldn't fetch news at the moment."
        except:
            return "News service is currently unavailable."
    
    def get_time(self):
        """Get current time"""
        return f"The current time is {datetime.now().strftime('%H:%M:%S')}"
    
    def get_date(self):
        """Get current date"""
        return f"Today is {datetime.now().strftime('%A, %B %d, %Y')}"
    
    def calculate(self, expression):
        """Perform mathematical calculations"""
        try:
            # Basic safety check
            allowed_chars = set('0123456789+-*/.() ')
            if not all(c in allowed_chars for c in expression):
                return "Invalid mathematical expression."
            
            result = eval(expression)
            return f"The result is {result}"
        except:
            return "I couldn't calculate that expression."
    
    def open_application(self, app_name):
        """Open applications"""
        try:
            if 'browser' in app_name.lower() or 'firefox' in app_name.lower():
                subprocess.Popen(['firefox'])
            elif 'terminal' in app_name.lower():
                subprocess.Popen(['gnome-terminal'])
            elif 'calculator' in app_name.lower():
                subprocess.Popen(['gnome-calculator'])
            elif 'file' in app_name.lower():
                subprocess.Popen(['nautilus'])
            else:
                subprocess.Popen([app_name])
            
            return f"Opening {app_name}"
        except:
            return f"Couldn't open {app_name}"
    
    def close_application(self, app_name):
        """Close applications"""
        try:
            subprocess.run(['pkill', app_name])
            return f"Closing {app_name}"
        except:
            return f"Couldn't close {app_name}"
    
    def control_volume(self, level):
        """Control system volume"""
        try:
            subprocess.run(['amixer', 'set', 'Master', f'{level}%'])
            return f"Volume set to {level}%"
        except:
            return "Couldn't control volume"
    
    def take_screenshot(self):
        """Take a screenshot"""
        try:
            screenshot = pyautogui.screenshot()
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"screenshot_{timestamp}.png"
            screenshot.save(f"/workspace/static/screenshots/{filename}")
            return f"Screenshot saved as {filename}"
        except:
            return "Couldn't take screenshot"
    
    def get_system_info(self):
        """Get system information"""
        try:
            cpu_percent = psutil.cpu_percent()
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return f"CPU: {cpu_percent}%, Memory: {memory.percent}%, Disk: {disk.percent}%"
        except:
            return "Couldn't get system information"
    
    def translate_text(self, text, target_language='en'):
        """Translate text"""
        try:
            translation = translator.translate(text, dest=target_language)
            return f"Translation: {translation.text}"
        except:
            return "Couldn't translate the text"
    
    def schedule_email(self, params, user_id):
        """Schedule an email"""
        try:
            conn = sqlite3.connect('jarvis.db')
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO scheduled_emails (user_id, recipient, subject, body, scheduled_time)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, params['recipient'], params['subject'], params['body'], params['time']))
            
            conn.commit()
            conn.close()
            
            return f"Email scheduled to {params['recipient']} for {params['time']}"
        except:
            return "Couldn't schedule the email"
    
    def set_reminder(self, params, user_id):
        """Set a reminder"""
        # This would integrate with the email scheduling system
        email_params = {
            'recipient': 'user@example.com',  # User's email
            'subject': 'Reminder',
            'body': params['message'],
            'time': params['time']
        }
        return self.schedule_email(email_params, user_id)
    
    def log_command(self, user_id, command, response, language):
        """Log command to database"""
        try:
            conn = sqlite3.connect('jarvis.db')
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO command_history (user_id, command, response, language)
                VALUES (?, ?, ?, ?)
            ''', (user_id, command, response, language))
            
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Error logging command: {str(e)}")
    
    # Helper methods for extracting parameters from commands
    def extract_city(self, command):
        words = command.split()
        for i, word in enumerate(words):
            if word.lower() in ['in', 'for', 'at']:
                if i + 1 < len(words):
                    return words[i + 1]
        return "London"
    
    def extract_math_expression(self, command):
        # Extract mathematical expression from command
        import re
        expression = re.search(r'[\d\+\-\*\/\.\(\)\s]+', command)
        return expression.group() if expression else "1+1"
    
    def extract_app_name(self, command):
        words = command.split()
        for i, word in enumerate(words):
            if word.lower() in ['open', 'close', 'start', 'launch']:
                if i + 1 < len(words):
                    return words[i + 1]
        return "firefox"
    
    def extract_volume_level(self, command):
        import re
        level = re.search(r'\d+', command)
        return level.group() if level else "50"
    
    def extract_translation_params(self, command):
        # Basic implementation - can be enhanced
        words = command.split()
        text = " ".join(words[2:])  # Assume "translate [text]"
        return text, 'en'
    
    def extract_email_params(self, command):
        # Basic implementation - can be enhanced
        return {
            'recipient': 'example@email.com',
            'subject': 'Scheduled Email',
            'body': command,
            'time': datetime.now()
        }
    
    def extract_reminder_params(self, command):
        # Basic implementation - can be enhanced
        return {
            'message': command,
            'time': datetime.now()
        }

# Initialize JARVIS
jarvis = JarvisAI()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    conn = sqlite3.connect('jarvis.db')
    cursor = conn.cursor()
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    cursor.execute('SELECT id FROM users WHERE username = ? AND password_hash = ?', 
                  (username, password_hash))
    user = cursor.fetchone()
    
    if user:
        session['user_id'] = user[0]
        
        # Log login
        cursor.execute('''
            INSERT INTO login_history (user_id, ip_address, user_agent)
            VALUES (?, ?, ?)
        ''', (user[0], request.remote_addr, request.headers.get('User-Agent')))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'user_id': user[0]})
    else:
        conn.close()
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    conn = sqlite3.connect('jarvis.db')
    cursor = conn.cursor()
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    try:
        cursor.execute('INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)', 
                      (username, password_hash, email))
        conn.commit()
        user_id = cursor.lastrowid
        session['user_id'] = user_id
        conn.close()
        
        return jsonify({'success': True, 'user_id': user_id})
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Username already exists'}), 409

@app.route('/process_command', methods=['POST'])
def process_command():
    data = request.get_json()
    command = data.get('command')
    language = data.get('language', 'auto')
    user_id = session.get('user_id')
    
    if not command:
        return jsonify({'error': 'Command required'}), 400
    
    response = jarvis.process_command(command, user_id, language)
    
    return jsonify({
        'response': response,
        'language': language,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/voice_recognition', methods=['POST'])
def voice_recognition():
    try:
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source, timeout=5)
        
        command = recognizer.recognize_google(audio)
        language = detect(command)
        user_id = session.get('user_id')
        
        response = jarvis.process_command(command, user_id, language)
        
        return jsonify({
            'command': command,
            'response': response,
            'language': language
        })
    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand audio'}), 400
    except sr.RequestError:
        return jsonify({'error': 'Speech recognition service unavailable'}), 500

@app.route('/speak', methods=['POST'])
def speak():
    data = request.get_json()
    text = data.get('text')
    
    if not text:
        return jsonify({'error': 'Text required'}), 400
    
    try:
        tts_engine.say(text)
        tts_engine.runAndWait()
        return jsonify({'success': True})
    except:
        return jsonify({'error': 'Text-to-speech unavailable'}), 500

@app.route('/history')
def get_history():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = sqlite3.connect('jarvis.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT command, response, language, timestamp
        FROM command_history
        WHERE user_id = ?
        ORDER BY timestamp DESC
        LIMIT 50
    ''', (user_id,))
    
    history = cursor.fetchall()
    conn.close()
    
    return jsonify([{
        'command': row[0],
        'response': row[1],
        'language': row[2],
        'timestamp': row[3]
    } for row in history])

@app.route('/logout')
def logout():
    session.clear()
    return jsonify({'success': True})

def email_scheduler():
    """Background task to send scheduled emails"""
    while True:
        try:
            conn = sqlite3.connect('jarvis.db')
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, recipient, subject, body FROM scheduled_emails
                WHERE scheduled_time <= ? AND sent = FALSE
            ''', (datetime.now(),))
            
            emails = cursor.fetchall()
            
            for email in emails:
                # Send email logic here
                print(f"Sending email to {email[1]}: {email[2]}")
                
                cursor.execute('UPDATE scheduled_emails SET sent = TRUE WHERE id = ?', (email[0],))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"Email scheduler error: {str(e)}")
        
        time.sleep(60)  # Check every minute

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Create necessary directories
    os.makedirs('/workspace/static/screenshots', exist_ok=True)
    
    # Start email scheduler in background
    email_thread = threading.Thread(target=email_scheduler, daemon=True)
    email_thread.start()
    
    # Run Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)