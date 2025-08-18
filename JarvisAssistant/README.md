# 🤖 Jarvis Assistant - Cross-Platform Voice Assistant

A modern, cross-platform voice assistant app inspired by Siri, built with React Native and Expo. Works on both iOS and Android devices.

![Jarvis Assistant](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-Expo-green)
![AI Powered](https://img.shields.io/badge/AI-OpenAI%20Compatible-orange)

## ✨ Features

- 🎤 **Voice Recognition** - Speak naturally to interact with Jarvis
- 🗣️ **Text-to-Speech** - Jarvis responds with natural voice
- 🧠 **AI Integration** - Optional OpenAI integration for advanced responses
- 🌙 **Dark Theme** - Beautiful, modern UI with cyberpunk aesthetics
- 📱 **Cross-Platform** - Works on both iOS and Android
- 🔄 **Real-time** - Instant voice processing and responses
- ⚙️ **Configurable** - Easy settings management
- 🚀 **Background Ready** - Designed for always-listening functionality

## 🎯 Built-in Commands

Jarvis can handle these commands without any API key:

- ⏰ **Time**: "What time is it?"
- 📅 **Date**: "What's the date today?"
- 👋 **Greetings**: "Hello Jarvis", "Hi there"
- 🙏 **Thanks**: "Thank you", "Thanks"
- 👋 **Goodbye**: "Goodbye", "See you later"
- 🌤️ **Weather**: "What's the weather?" (placeholder)
- 🎵 **Music**: "Play music" (placeholder)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS testing) or Android Studio (for Android testing)

### Installation

1. **Clone the repository**
   ```bash
   cd /workspace/JarvisAssistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - **iOS**: Press `i` to open iOS Simulator
   - **Android**: Press `a` to open Android Emulator
   - **Physical Device**: Scan the QR code with Expo Go app

## 🔧 Configuration

### OpenAI Integration (Optional)

To enable advanced AI responses:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Open the app and tap the ⚙️ settings icon
3. Enter your API key in the settings modal
4. Save the settings

Without an API key, Jarvis will use built-in command processing.

### Permissions

The app requires these permissions:
- **Microphone**: For voice input
- **Audio Recording**: For speech recognition
- **Background Audio**: For always-listening mode (future feature)

## 📱 Usage

### Basic Usage

1. **Launch the app**
2. **Tap the microphone button** or say "Hey Jarvis" (when wake word is implemented)
3. **Speak your command** clearly
4. **Wait for Jarvis to respond** with voice and text

### Quick Actions

Use the quick action buttons for common commands:
- ⏰ **Time** - Get current time
- 📅 **Date** - Get today's date
- 👋 **Greet** - Say hello to Jarvis

## 🏗️ Architecture

```
JarvisAssistant/
├── App.tsx                 # Main application component
├── services/
│   ├── VoiceService.ts     # Speech recognition & recording
│   └── AIService.ts        # AI processing & responses
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

### Key Components

- **VoiceService**: Handles audio recording and speech recognition
- **AIService**: Processes commands and generates responses
- **App.tsx**: Main UI with voice visualization and chat interface

## 🚀 Advanced Features (Planned)

- 🎯 **Wake Word Detection**: "Hey Jarvis" activation
- 🔄 **Background Service**: Always-listening mode
- 📞 **Device Integration**: Contacts, calendar, apps
- 🌐 **Web Search**: Real-time information
- 🎵 **Music Control**: Spotify, Apple Music integration
- 📍 **Location Services**: Weather, navigation
- 🏠 **Smart Home**: IoT device control

## 🔧 Development

### Adding New Commands

1. **Built-in Commands**: Add to `AIService.handleBuiltInCommands()`
2. **AI Commands**: Will be processed by OpenAI automatically

### Customizing UI

- Modify colors in the `styles` object in `App.tsx`
- Update gradients in the `LinearGradient` component
- Customize animations in the pulse and glow effects

### Testing

```bash
# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on web (limited functionality)
npm run web
```

## 📦 Building for Production

### iOS (requires macOS)

```bash
# Build for iOS App Store
expo build:ios
```

### Android

```bash
# Build APK
expo build:android -t apk

# Build AAB for Play Store
expo build:android -t app-bundle
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by Iron Man's Jarvis AI assistant
- Built with React Native and Expo
- Voice recognition powered by device APIs
- Optional AI responses via OpenAI

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section below
2. Open an issue on GitHub
3. Check Expo documentation

## 🔍 Troubleshooting

### Common Issues

**Microphone not working:**
- Ensure microphone permissions are granted
- Check device audio settings
- Restart the app

**Voice recognition failing:**
- Speak clearly and close to the microphone
- Check internet connection (for cloud recognition)
- Try in a quiet environment

**App crashes on startup:**
- Clear Expo cache: `expo r -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check device compatibility

**OpenAI responses not working:**
- Verify API key is correct
- Check internet connection
- Ensure you have OpenAI credits

---

Made with ❤️ for the future of voice assistants