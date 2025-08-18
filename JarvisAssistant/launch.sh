#!/bin/bash

echo "🤖 Starting Jarvis Assistant..."
echo "================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting development server..."
echo ""
echo "Available options:"
echo "  - Press 'i' for iOS Simulator"
echo "  - Press 'a' for Android Emulator" 
echo "  - Press 'w' for Web Browser"
echo "  - Scan QR code with Expo Go app on your device"
echo ""

npm start