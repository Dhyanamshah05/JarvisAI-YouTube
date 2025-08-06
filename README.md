# 🤖 JARVIS AI Assistant

**Just A Rather Very Intelligent System** - An Iron Man inspired AI assistant with voice control, desktop automation, and multilingual capabilities.

![JARVIS Interface](https://img.shields.io/badge/Status-Operational-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎤 Voice Control
- **Speech Recognition**: Natural voice commands in multiple languages
- **Text-to-Speech**: JARVIS responds with synthesized voice
- **Wake Word**: Click the core or use voice commands
- **Real-time Processing**: Instant command recognition and response

### 🖥️ Desktop Automation
- **Application Control**: Open/close applications
- **System Monitoring**: Real-time CPU, memory, and disk usage
- **Screenshot Capture**: Take and save screenshots
- **Volume Control**: Adjust system audio levels

### 🌍 Multilingual Support
- **Language Detection**: Auto-detect spoken/written language
- **Translation**: Translate text between languages
- **Global Commands**: Works in 13+ languages including:
  - English, Spanish, French, German, Italian
  - Portuguese, Russian, Japanese, Korean, Chinese
  - Arabic, Hindi, and more

### 📧 Smart Scheduling
- **Email Automation**: Schedule and send emails automatically
- **Reminder System**: Set time-based reminders
- **Background Processing**: Runs scheduled tasks in background

### 🔐 User Management
- **Secure Authentication**: Encrypted user accounts
- **Login History**: Track access and usage
- **Command Logging**: Store and review command history
- **Session Management**: Persistent user sessions

### 🌟 AI Capabilities
- **Weather Information**: Get current weather for any city
- **News Updates**: Latest headlines and news
- **Mathematical Calculations**: Perform complex calculations
- **System Information**: Real-time system statistics
- **Smart Responses**: Context-aware AI responses

## 🚀 Quick Start

### Prerequisites
- **Operating System**: Linux (Ubuntu/Debian recommended)
- **Python**: 3.8 or higher
- **Hardware**: Microphone and speakers for voice features
- **Network**: Internet connection for AI features

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jarvis-ai-assistant.git
cd jarvis-ai-assistant

# Run the setup script
chmod +x setup.py
python3 setup.py
```

### 2. Configuration

Edit the `.env` file to add your API keys:

```bash
# Get your free API keys:
# Weather: https://openweathermap.org/api
# News: https://newsapi.org/

WEATHER_API_KEY=your_openweather_api_key_here
NEWS_API_KEY=your_newsapi_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
```

### 3. Launch JARVIS

```bash
python3 app.py
```

Open your browser to: `http://localhost:5000`

## 🎮 Usage Guide

### Voice Commands

**System Control:**
- "What time is it?"
- "What's the weather in London?"
- "Take a screenshot"
- "Open browser"
- "Set volume to 50%"
- "Show system information"

**Calculations:**
- "Calculate 15 * 24 + 30"
- "What's 50% of 200?"

**Information:**
- "Get latest news"
- "What's the weather like?"
- "Translate hello to Spanish"

**Scheduling:**
- "Send email to john@example.com"
- "Set reminder for tomorrow"

### Text Interface

You can also type commands directly into the command interface. The system supports the same commands as voice input.

### Quick Actions

Use the quick action buttons for common tasks:
- ⏰ **Time**: Get current time
- 🌤️ **Weather**: Check weather
- 📰 **News**: Latest headlines
- 💻 **System**: System information
- 📸 **Screenshot**: Capture screen

## 🛠️ Architecture

```
JARVIS AI Assistant/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── setup.py              # Installation script
├── .env                  # Environment variables
├── jarvis.db             # SQLite database
├── templates/
│   └── index.html        # Main interface
├── static/
│   ├── css/
│   │   └── style.css     # JARVIS styling
│   ├── js/
│   │   └── main.js       # Frontend logic
│   └── screenshots/      # Captured screenshots
└── logs/                 # Application logs
```

### Technology Stack

**Backend:**
- **Flask**: Web framework
- **SQLite**: Database
- **SpeechRecognition**: Voice input
- **pyttsx3**: Text-to-speech
- **googletrans**: Translation
- **psutil**: System monitoring

**Frontend:**
- **HTML5/CSS3**: Interface structure and styling
- **JavaScript**: Interactive functionality
- **Particles.js**: Animated background
- **Web Speech API**: Browser voice recognition

## 🔧 Advanced Configuration

### Voice Settings

```python
# Adjust speech recognition sensitivity
recognizer.energy_threshold = 300
recognizer.dynamic_energy_threshold = True

# Configure text-to-speech voice
tts_engine.setProperty('rate', 150)
tts_engine.setProperty('volume', 0.8)
```

### Adding Custom Commands

Extend JARVIS by adding custom commands in `app.py`:

```python
def custom_command(self, params):
    """Add your custom functionality here"""
    return "Custom command executed successfully"

# Register the command
self.commands['custom'] = self.custom_command
```

### Database Customization

Modify database schema in the `init_database()` function to add custom tables or fields.

## 🎨 Customization

### Interface Themes

Modify CSS variables in `style.css` to change the appearance:

```css
:root {
    --primary-color: #00ffff;      /* Change primary color */
    --secondary-color: #0080ff;     /* Change secondary color */
    --bg-dark: #0a0a0a;            /* Change background */
}
```

### Voice Personalities

Customize the TTS voice in `main.js`:

```javascript
utterance.rate = 0.9;          // Speech speed
utterance.pitch = 1.2;         // Voice pitch
utterance.volume = 0.8;        // Volume level
```

## 🔒 Security Features

- **Password Hashing**: SHA-256 encrypted passwords
- **Session Management**: Secure user sessions
- **Input Validation**: Command sanitization
- **Rate Limiting**: Protection against abuse
- **Secure API Keys**: Environment-based configuration

## 🐛 Troubleshooting

### Voice Recognition Issues

**Problem**: Voice commands not working
**Solution**: 
1. Check microphone permissions in browser
2. Ensure microphone is not muted
3. Try using Chrome/Edge (better WebRTC support)

### Audio Output Issues

**Problem**: JARVIS not speaking responses
**Solution**:
1. Check system audio settings
2. Verify speakers are connected
3. Test with `speaker-test` command

### Installation Problems

**Problem**: Dependencies failing to install
**Solution**:
1. Update system packages: `sudo apt update`
2. Install build tools: `sudo apt install build-essential`
3. Use virtual environment: `python3 -m venv jarvis-env`

### API Integration Issues

**Problem**: Weather/News not working
**Solution**:
1. Verify API keys in `.env` file
2. Check API key validity and limits
3. Ensure internet connectivity

## 📚 API Reference

### Command Processing Endpoint

```http
POST /process_command
Content-Type: application/json

{
    "command": "what time is it",
    "language": "en"
}
```

### Voice Recognition Endpoint

```http
POST /voice_recognition
```

### User Authentication

```http
POST /login
Content-Type: application/json

{
    "username": "user",
    "password": "password"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Development Setup

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
python -m pytest tests/

# Format code
black app.py
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Iron Man/Marvel** - Inspiration for JARVIS design
- **OpenWeather** - Weather data API
- **NewsAPI** - News headlines API
- **Google** - Speech recognition and translation services
- **Flask Community** - Web framework and ecosystem

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/jarvis-ai-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/jarvis-ai-assistant/discussions)
- **Email**: support@jarvis-ai.com

---

**Built with ❤️ by AI Enthusiasts**

*"Sometimes you gotta run before you can walk."* - Tony Stark