#!/usr/bin/env python3
"""
JARVIS AI Assistant Setup Script
Installs system dependencies and configures the application
"""

import subprocess
import sys
import os
import sqlite3

def run_command(command, check=True):
    """Run a shell command"""
    try:
        result = subprocess.run(command, shell=True, check=check, 
                              capture_output=True, text=True)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e}")
        return False

def install_system_dependencies():
    """Install system-level dependencies"""
    print("🔧 Installing system dependencies...")
    
    # Update package list
    run_command("sudo apt-get update", check=False)
    
    # Install required system packages
    packages = [
        "python3-pip",
        "python3-dev",
        "portaudio19-dev",
        "python3-pyaudio",
        "espeak",
        "espeak-data",
        "libespeak1",
        "libespeak-dev",
        "festival",
        "alsa-utils",
        "sox",
        "libsox-fmt-all"
    ]
    
    for package in packages:
        print(f"Installing {package}...")
        success = run_command(f"sudo apt-get install -y {package}", check=False)
        if success:
            print(f"✅ {package} installed successfully")
        else:
            print(f"⚠️  Warning: Could not install {package}")

def install_python_dependencies():
    """Install Python dependencies"""
    print("🐍 Installing Python dependencies...")
    
    # Upgrade pip
    run_command(f"{sys.executable} -m pip install --upgrade pip")
    
    # Install requirements
    if os.path.exists("requirements.txt"):
        result = run_command(f"{sys.executable} -m pip install -r requirements.txt")
        if result:
            print("✅ Python dependencies installed successfully")
        else:
            print("❌ Failed to install Python dependencies")
            return False
    else:
        print("❌ requirements.txt not found")
        return False
    
    return True

def setup_database():
    """Initialize the SQLite database"""
    print("🗄️  Setting up database...")
    
    try:
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
        print("✅ Database setup completed")
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    print("📁 Creating directories...")
    
    directories = [
        "static/screenshots",
        "logs",
        "data"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created {directory}")

def setup_environment():
    """Setup environment variables"""
    print("🔐 Setting up environment...")
    
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write("""# JARVIS AI Assistant Environment Variables
SECRET_KEY=jarvis_secret_key_change_in_production_environment
WEATHER_API_KEY=your_openweather_api_key_here
NEWS_API_KEY=your_newsapi_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
""")
        print("✅ Environment file created")
        print("📝 Please edit .env file to add your API keys")
    else:
        print("✅ Environment file already exists")

def test_audio():
    """Test audio capabilities"""
    print("🔊 Testing audio capabilities...")
    
    # Test speaker
    speaker_test = run_command("speaker-test -t sine -f 1000 -l 1", check=False)
    if speaker_test:
        print("✅ Speaker test passed")
    else:
        print("⚠️  Speaker test failed - audio output may not work")
    
    # Test microphone
    mic_test = run_command("arecord -d 1 -f cd /dev/null", check=False)
    if mic_test:
        print("✅ Microphone test passed")
    else:
        print("⚠️  Microphone test failed - voice input may not work")

def main():
    """Main setup function"""
    print("🤖 JARVIS AI Assistant Setup")
    print("=" * 50)
    
    # Check if running as root
    if os.geteuid() == 0:
        print("❌ Please don't run this script as root")
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Setup environment
    setup_environment()
    
    # Install system dependencies
    install_system_dependencies()
    
    # Install Python dependencies
    if not install_python_dependencies():
        print("❌ Setup failed during Python dependency installation")
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        print("❌ Setup failed during database setup")
        sys.exit(1)
    
    # Test audio
    test_audio()
    
    print("\n🎉 JARVIS AI Assistant setup completed!")
    print("\n📋 Next steps:")
    print("1. Edit .env file to add your API keys:")
    print("   - Get Weather API key from: https://openweathermap.org/api")
    print("   - Get News API key from: https://newsapi.org/")
    print("   - Configure email settings for scheduled emails")
    print("\n2. Start JARVIS:")
    print("   python3 app.py")
    print("\n3. Open your browser to: http://localhost:5000")
    print("\n4. Register a new account and start using JARVIS!")
    print("\n🔊 Voice commands work best with:")
    print("   - A good quality microphone")
    print("   - Quiet environment")
    print("   - Clear speech")

if __name__ == "__main__":
    main()