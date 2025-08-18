# Jarvis Assistant - Cross-Platform Voice AI

A sophisticated, cross-platform voice assistant built with React Native that works on both Android and iOS devices, inspired by Siri and other modern voice assistants.

## 🚀 Features

### Core Voice Capabilities
- **Voice Recognition**: Advanced speech-to-text with real-time processing
- **Text-to-Speech**: Natural-sounding voice responses
- **Offline Commands**: Works without internet for basic functions
- **AI Integration**: OpenAI GPT integration for intelligent responses (optional)

### Smart Commands
- **Time & Date**: "What time is it?", "What day is it?"
- **Calculator**: "Calculate 15 plus 27", "What is 10 times 5?"
- **Conversation**: Greetings, jokes, and casual chat
- **System Info**: Battery, volume, and device status
- **Custom AI**: Any question with OpenAI integration

### User Experience
- **Beautiful UI**: Modern, dark theme with blue accents
- **Voice Waveform**: Animated visual feedback during listening
- **Command History**: Track your recent voice interactions
- **Settings Panel**: Customize voice, TTS, and permissions
- **Cross-Platform**: Consistent experience on Android and iOS

## 📱 Platforms

- ✅ **Android** (API 21+)
- ✅ **iOS** (12.0+)
- 🔄 **Web** (Coming Soon)

## 🛠️ Tech Stack

- **Frontend**: React Native 0.72.6
- **Language**: TypeScript
- **Voice Recognition**: react-native-voice
- **Text-to-Speech**: react-native-tts
- **Permissions**: react-native-permissions
- **Navigation**: React Navigation 6
- **State Management**: React Hooks
- **Styling**: React Native StyleSheet
- **AI Integration**: OpenAI GPT-3.5 Turbo

## 📋 Prerequisites

- Node.js 16+ 
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- OpenAI API key (optional, for AI features)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd jarvis-assistant
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🏃‍♂️ Running the App

### Android
```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

### iOS (macOS only)
```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios
```

## 🔧 Configuration

### OpenAI API Setup
1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to the Settings screen in the app
3. Or set it in your `.env` file

### Permissions
The app will request these permissions:
- **Microphone**: For voice recognition
- **Storage**: For saving settings and data
- **Notifications**: For alerts and reminders

## 🎯 Usage

### Basic Voice Commands
- **Activation**: Long press the microphone button or tap once
- **Speaking**: Speak clearly after the "Listening..." indicator
- **Commands**: Use natural language like "What time is it?"

### Voice Command Examples
```
"What time is it?"
"Calculate 25 plus 13"
"Tell me a joke"
"Hello Jarvis"
"What can you do?"
"Goodbye"
```

### Advanced Features
- **AI Responses**: Ask any question with OpenAI integration
- **Custom Wake Word**: Coming soon
- **Background Processing**: Voice recognition while using other apps

## 🏗️ Project Structure

```
jarvis-assistant/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Main app screens
│   ├── services/           # Business logic and API calls
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
├── App.tsx                 # Main app component
├── index.js                # App entry point
└── package.json            # Dependencies and scripts
```

## 🔒 Security & Privacy

- **Local Processing**: Basic commands work offline
- **Secure Storage**: API keys stored securely
- **Permission Control**: Minimal required permissions
- **Data Privacy**: Voice data not stored permanently

## 🚧 Development

### Adding New Commands
1. Edit `src/services/JarvisService.ts`
2. Add command logic to `processOfflineCommand()`
3. Test with voice recognition

### Customizing UI
1. Modify styles in component files
2. Update theme colors in `App.tsx`
3. Add new icons from Material Icons

### Building for Production
```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

## 🐛 Troubleshooting

### Common Issues

**Voice Recognition Not Working**
- Check microphone permissions
- Ensure device microphone is working
- Try speaking more clearly

**App Crashes on Launch**
- Clear Metro cache: `npm start -- --reset-cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Build Errors**
- Update React Native CLI: `npm install -g @react-native-community/cli`
- Check platform-specific setup guides

### Debug Mode
```bash
# Enable debug logging
npm start -- --reset-cache
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community
- OpenAI for AI capabilities
- Material Design for icons
- Contributors and testers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@jarvisassistant.com

## 🔮 Roadmap

- [ ] Wake word detection
- [ ] Web platform support
- [ ] Multi-language support
- [ ] Custom voice models
- [ ] Smart home integration
- [ ] Calendar and reminders
- [ ] Music control
- [ ] Navigation integration

---

**Built with ❤️ using React Native**

*Jarvis Assistant - Your AI companion across all devices*