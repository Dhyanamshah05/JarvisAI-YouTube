import speech_recognition as sr
import os
import webbrowser
import openai
from config import apikey
import datetime
import random
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import schedule
import threading
import time
import smtplib
from email.mime.text import MIMEText
from langdetect import detect


chatStr = ""
# https://youtu.be/Z3ZAJoi4x6Q
def chat(query):
    global chatStr
    print(chatStr)
    openai.api_key = apikey
    chatStr += f"Harry: {query}\n Jarvis: "
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt= chatStr,
        temperature=0.7,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    # todo: Wrap this inside of a  try catch block
    say(response["choices"][0]["text"])
    chatStr += f"{response['choices'][0]['text']}\n"
    return response["choices"][0]["text"]


def ai(prompt):
    openai.api_key = apikey
    text = f"OpenAI response for Prompt: {prompt} \n *************************\n\n"

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.7,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    # todo: Wrap this inside of a  try catch block
    # print(response["choices"][0]["text"])
    text += response["choices"][0]["text"]
    if not os.path.exists("Openai"):
        os.mkdir("Openai")

    # with open(f"Openai/prompt- {random.randint(1, 2343434356)}", "w") as f:
    with open(f"Openai/{''.join(prompt.split('intelligence')[1:]).strip() }.txt", "w") as f:
        f.write(text)

def say(text):
    os.system(f'say "{text}"')

def takeCommand():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        # r.pause_threshold =  0.6
        audio = r.listen(source)
        try:
            print("Recognizing...")
            query = r.recognize_google(audio, language="en-in")
            print(f"User said: {query}")
            return query
        except Exception as e:
            return "Some Error Occurred. Sorry from Jarvis"

app = Flask(__name__)
CORS(app)

# Database setup
engine = create_engine('sqlite:///jarvis.db')
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

class LoginHistory(Base):
    __tablename__ = 'login_history'
    id = Column(Integer, primary_key=True)
    username = Column(String)
    login_time = Column(DateTime)

Base.metadata.create_all(engine)

# Email scheduling
scheduled_emails = []
def send_scheduled_email(to, subject, body):
    # Replace with your SMTP config
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = 'your@email.com'
    msg['To'] = to
    try:
        with smtplib.SMTP('smtp.example.com', 587) as server:
            server.starttls()
            server.login('your@email.com', 'password')
            server.sendmail('your@email.com', [to], msg.as_string())
    except Exception as e:
        print('Email error:', e)

def email_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)

threading.Thread(target=email_scheduler, daemon=True).start()

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    username = data.get('username')
    # For demo, accept any login
    from datetime import datetime
    lh = LoginHistory(username=username, login_time=datetime.now())
    session.add(lh)
    session.commit()
    return jsonify({'success': True})

@app.route('/api/command', methods=['POST'])
def api_command():
    data = request.json
    command = data.get('command', '')
    lang = detect(command)
    if 'schedule email' in command.lower():
        # Example: schedule email to test@email.com at 10:00 Hello
        import re
        m = re.search(r'schedule email to (\S+) at (\d{2}:\d{2}) (.+)', command, re.I)
        if m:
            to, at, body = m.groups()
            schedule.every().day.at(at).do(send_scheduled_email, to, 'Scheduled Email', body)
            return jsonify({'response': f'Email scheduled to {to} at {at}.'})
        else:
            return jsonify({'response': 'Invalid email schedule format.'})
    # Add more desktop control and smart features here
    if lang != 'en':
        return jsonify({'response': f'Detected language: {lang}. Sorry, only English commands are fully supported yet.'})
    # Use OpenAI for chat
    try:
        response = chat(command)
    except Exception as e:
        response = f'Error: {e}'
    return jsonify({'response': response})


if __name__ == '__main__':
    print('Welcome to Jarvis A.I')
    say("Jarvis A.I")
    while True:
        print("Listening...")
        query = takeCommand()
        # todo: Add more sites
        sites = [["youtube", "https://www.youtube.com"], ["wikipedia", "https://www.wikipedia.com"], ["google", "https://www.google.com"],]
        for site in sites:
            if f"Open {site[0]}".lower() in query.lower():
                say(f"Opening {site[0]} sir...")
                webbrowser.open(site[1])
        # todo: Add a feature to play a specific song
        if "open music" in query:
            musicPath = "/Users/harry/Downloads/downfall-21371.mp3"
            os.system(f"open {musicPath}")

        elif "the time" in query:
            musicPath = "/Users/harry/Downloads/downfall-21371.mp3"
            hour = datetime.datetime.now().strftime("%H")
            min = datetime.datetime.now().strftime("%M")
            say(f"Sir time is {hour} bajke {min} minutes")

        elif "open facetime".lower() in query.lower():
            os.system(f"open /System/Applications/FaceTime.app")

        elif "open pass".lower() in query.lower():
            os.system(f"open /Applications/Passky.app")

        elif "Using artificial intelligence".lower() in query.lower():
            ai(prompt=query)

        elif "Jarvis Quit".lower() in query.lower():
            exit()

        elif "reset chat".lower() in query.lower():
            chatStr = ""

        else:
            print("Chatting...")
            chat(query)

        app.run(host='0.0.0.0', port=5000)