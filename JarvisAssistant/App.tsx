import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { keepAwake, allowSleepAsync } from 'expo-keep-awake';
import VoiceService from './services/VoiceService';
import AIService from './services/AIService';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [wakeWordActive, setWakeWordActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize services
    initializeServices();
    
    // Start wake word detection
    startWakeWordDetection();
    
    // Welcome message
    speak("Hello, I'm Jarvis. Your personal assistant is ready.");
    
    return () => {
      allowSleepAsync();
    };
  }, []);

  const initializeServices = async () => {
    try {
      const audioInitialized = await VoiceService.initializeAudio();
      if (!audioInitialized) {
        Alert.alert('Permission Required', 'Microphone access is required for voice commands.');
      }
      
      // Set API key if available
      if (apiKey) {
        AIService.setApiKey(apiKey);
      }
    } catch (error) {
      console.error('Error initializing services:', error);
    }
  };

  const startWakeWordDetection = () => {
    setWakeWordActive(true);
    keepAwake();
    // In a real implementation, you would use a wake word detection library
    // For now, we'll simulate it with the main button
  };

  const speak = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 0.9,
      rate: 0.9,
      voice: 'com.apple.ttsbundle.Samantha-compact', // iOS voice
    });
  };

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    addMessage(command, true);
    
    try {
      const aiResponse = await AIService.processCommand(command);
      addMessage(aiResponse.text, false);
      speak(aiResponse.text);
    } catch (error) {
      console.error('Error processing command:', error);
      const errorMessage = "Sorry, I encountered an error processing your request.";
      addMessage(errorMessage, false);
      speak(errorMessage);
    }
    
    setIsProcessing(false);
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      startPulseAnimation();
      
      const recordingStarted = await VoiceService.startRecording();
      if (!recordingStarted) {
        throw new Error('Could not start recording');
      }
      
      // Auto-stop recording after 5 seconds (or implement voice activity detection)
      setTimeout(async () => {
        const audioUri = await VoiceService.stopRecording();
        setIsListening(false);
        stopPulseAnimation();
        
        if (audioUri) {
          setIsProcessing(true);
          try {
            const result = await VoiceService.recognizeSpeech(audioUri);
            setIsProcessing(false);
            processCommand(result.transcript);
          } catch (error) {
            setIsProcessing(false);
            Alert.alert('Error', 'Could not recognize speech');
          }
        }
      }, 5000);
      
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      stopPulseAnimation();
      Alert.alert('Error', 'Could not start voice recognition');
    }
  };

  const startPulseAnimation = () => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulse.start();
    glow.start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.setValue(1);
    glowAnim.setValue(0);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>JARVIS</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setShowSettings(true)}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Personal Assistant</Text>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: wakeWordActive ? '#00ff41' : '#ff4444' }
            ]} />
            <Text style={styles.statusText}>
              {wakeWordActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.jarvisMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.jarvisMessageText
              ]}>
                {message.text}
              </Text>
              <Text style={styles.timestamp}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Voice Visualizer */}
        <View style={styles.visualizerContainer}>
          {isListening && (
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: glowAnim,
                  transform: [{ scale: pulseAnim }],
                }
              ]}
            />
          )}
        </View>

        {/* Main Control Button */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={startListening}
            disabled={isListening || isProcessing}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.buttonInner,
                {
                  transform: [{ scale: pulseAnim }],
                  backgroundColor: isListening ? '#00ff41' : isProcessing ? '#ffaa00' : '#0ea5e9'
                }
              ]}
            >
              <Text style={styles.buttonText}>
                {isListening ? '🎤' : isProcessing ? '🤔' : '🗣️'}
              </Text>
            </Animated.View>
          </TouchableOpacity>
          
          <Text style={styles.instructionText}>
            {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to speak'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => processCommand("What time is it?")}
          >
            <Text style={styles.quickActionText}>⏰ Time</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => processCommand("What's the date today?")}
          >
            <Text style={styles.quickActionText}>📅 Date</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => processCommand("Hello Jarvis")}
          >
            <Text style={styles.quickActionText}>👋 Greet</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSettings}
          onRequestClose={() => setShowSettings(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Settings</Text>
              
              <Text style={styles.inputLabel}>OpenAI API Key (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="Enter your OpenAI API key"
                placeholderTextColor="#8892b0"
                secureTextEntry={true}
              />
              
              <Text style={styles.helpText}>
                Adding an API key enables advanced AI responses. The app works without it using built-in commands.
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowSettings(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={() => {
                    AIService.setApiKey(apiKey);
                    setShowSettings(false);
                    Alert.alert('Settings Saved', 'Your API key has been updated.');
                  }}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff41',
    letterSpacing: 3,
  },
  settingsButton: {
    position: 'absolute',
    right: 20,
    padding: 10,
  },
  settingsIcon: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
    marginTop: 5,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#8892b0',
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  messageContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    borderColor: '#0ea5e9',
    borderWidth: 1,
  },
  jarvisMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderColor: '#00ff41',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#e2e8f0',
  },
  jarvisMessageText: {
    color: '#00ff41',
  },
  timestamp: {
    fontSize: 12,
    color: '#8892b0',
    marginTop: 5,
  },
  visualizerContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowEffect: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0, 255, 65, 0.3)',
    position: 'absolute',
  },
  controlsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  mainButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ff41',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 30,
  },
  instructionText: {
    color: '#8892b0',
    fontSize: 16,
    marginTop: 15,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  quickAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickActionText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    width: '90%',
    borderColor: '#00ff41',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff41',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#e2e8f0',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#e2e8f0',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 15,
  },
  helpText: {
    color: '#8892b0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    borderColor: '#00ff41',
    borderWidth: 1,
  },
  modalButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
});