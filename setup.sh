#!/bin/bash

echo "🤖 Welcome to Jarvis Assistant Setup!"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if React Native CLI is installed
if ! command -v react-native &> /dev/null; then
    echo "📱 Installing React Native CLI..."
    npm install -g @react-native-community/cli
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔑 Creating .env file..."
    cat > .env << EOF
# OpenAI API Key (optional)
# Get your API key from: https://platform.openai.com/
OPENAI_API_KEY=your_api_key_here

# Other configuration options
NODE_ENV=development
EOF
    echo "✅ .env file created. Please add your OpenAI API key if you have one."
fi

# Platform-specific setup
echo "🔧 Platform-specific setup..."

# Check if running on macOS for iOS setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS detected - iOS setup available"
    
    # Check if Xcode is installed
    if command -v xcodebuild &> /dev/null; then
        echo "✅ Xcode detected"
        
        # Check if CocoaPods is installed
        if ! command -v pod &> /dev/null; then
            echo "📱 Installing CocoaPods..."
            sudo gem install cocoapods
        fi
        
        echo "📱 Installing iOS dependencies..."
        cd ios && pod install && cd ..
        
        if [ $? -eq 0 ]; then
            echo "✅ iOS setup completed"
        else
            echo "⚠️  iOS setup had issues. You may need to run 'cd ios && pod install' manually."
        fi
    else
        echo "⚠️  Xcode not detected. iOS development will not be available."
        echo "   Install Xcode from the Mac App Store to enable iOS development."
    fi
else
    echo "🐧 Linux/Windows detected - iOS development not available"
fi

# Check if Android SDK is available
if command -v adb &> /dev/null; then
    echo "🤖 Android SDK detected"
else
    echo "⚠️  Android SDK not detected. Install Android Studio to enable Android development."
    echo "   Visit: https://developer.android.com/studio"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to .env file (optional)"
echo "2. Start the development server: npm start"
echo "3. Run on Android: npm run android"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "4. Run on iOS: npm run ios"
fi
echo ""
echo "For more information, see README.md"
echo ""
echo "Happy coding! 🚀"