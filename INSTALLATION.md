# 🤖 JARVIS AI Assistant - Installation Guide

## Quick Demo (Minimal Setup)

For a quick demo without full dependencies:

```bash
# 1. Navigate to the project directory
cd /workspace

# 2. Run the demo (no additional setup required)
python3 demo.py
```

**Demo Login:** 
- Username: `demo`
- Password: `demo`

**Demo Features:**
- Time and date queries
- Mathematical calculations  
- Weather simulation (demo data)
- News headlines (demo data)
- System information (demo data)
- Translation examples
- Help system

---

## Full Installation (Complete Features)

For the complete JARVIS experience with voice recognition, desktop automation, and all features:

### Prerequisites

```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt update
sudo apt install python3-pip python3-dev python3-venv
sudo apt install portaudio19-dev python3-pyaudio
sudo apt install espeak espeak-data libespeak1 libespeak-dev
sudo apt install alsa-utils sox libsox-fmt-all
```

### Setup Steps

```bash
# 1. Create virtual environment
python3 -m venv jarvis-env
source jarvis-env/bin/activate

# 2. Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 3. Run setup script
python3 setup.py

# 4. Configure API keys (optional)
# Edit .env file with your API keys:
# - OpenWeather API: https://openweathermap.org/api
# - News API: https://newsapi.org/

# 5. Start JARVIS
python3 app.py
```

### API Configuration (Optional)

Get free API keys for enhanced features:

1. **Weather Data**: [OpenWeather API](https://openweathermap.org/api)
2. **News Headlines**: [NewsAPI](https://newsapi.org/)

Add them to your `.env` file:
```
WEATHER_API_KEY=your_openweather_api_key
NEWS_API_KEY=your_newsapi_key
```

---

## Quick Start Commands

Once JARVIS is running (http://localhost:5000):

### Voice Commands (Full Version)
- Click the microphone button or core visual
- Say: "Hello JARVIS"
- Try: "What time is it?"

### Text Commands (Both Versions)
- "hello" - Greet JARVIS
- "what time is it" - Current time
- "calculate 15 * 24" - Math operations  
- "weather" - Weather information
- "news" - Latest headlines
- "system info" - System status
- "help" - Show available commands

---

## Troubleshooting

### Demo Issues
- **Port in use**: Change port in `demo.py` (line with `port=5000`)
- **Import errors**: Make sure you're in the correct directory

### Full Installation Issues
- **Voice not working**: Check microphone permissions in browser
- **Audio issues**: Test with `speaker-test` command
- **API errors**: Verify API keys in `.env` file
- **Permission errors**: Don't run as root user

### Browser Compatibility
- **Best**: Chrome, Edge (better WebRTC support)
- **Good**: Firefox, Safari
- **Required**: JavaScript enabled

---

## File Structure

```
jarvis-ai-assistant/
├── app.py              # Full JARVIS application
├── demo.py             # Demo version (minimal dependencies)
├── requirements.txt    # Python dependencies
├── setup.py           # Installation script
├── run_demo.sh        # Demo runner script
├── .env               # Environment variables
├── templates/
│   └── index.html     # Web interface
├── static/
│   ├── css/style.css  # Styling
│   └── js/main.js     # Frontend logic
└── README.md          # Complete documentation
```

---

## Next Steps

1. **Try the demo** first to see the interface
2. **Install full version** for complete features
3. **Configure API keys** for real weather/news data
4. **Customize commands** by editing `app.py`
5. **Add voice training** for better recognition

For detailed documentation, see [README.md](README.md)