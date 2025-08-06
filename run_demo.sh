#!/bin/bash

# JARVIS AI Assistant Demo Runner
echo "🤖 JARVIS AI Assistant Demo"
echo "=========================="

# Check if virtual environment exists
if [ ! -d "jarvis-env" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv jarvis-env
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source jarvis-env/bin/activate

# Install basic dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install Flask Flask-CORS python-dotenv

# Check if demo.py exists
if [ ! -f "demo.py" ]; then
    echo "❌ demo.py not found!"
    exit 1
fi

echo ""
echo "🚀 Starting JARVIS Demo Server..."
echo "🔗 Open your browser to: http://localhost:5000"
echo "👤 Login with: username=demo, password=demo"
echo ""
echo "💡 Try these commands:"
echo "   • hello"
echo "   • what time is it"
echo "   • calculate 15 * 24"
echo "   • weather"
echo "   • help"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the demo
python demo.py