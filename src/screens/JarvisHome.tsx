import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import { useKeepAwake } from 'react-native-keep-awake';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

import VoiceWaveform from '../components/VoiceWaveform';
import CommandHistory from '../components/CommandHistory';
import { JarvisService } from '../services/JarvisService';
import { PermissionService } from '../services/PermissionService';

type JarvisHomeNavigationProp = StackNavigationProp<RootStackParamList, 'JarvisHome'>;

const { width, height } = Dimensions.get('window');

const JarvisHome: React.FC = () => {
  useKeepAwake();
  const navigation = useNavigation<JarvisHomeNavigationProp>();
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const jarvisService = useRef(new JarvisService()).current;
  const permissionService = useRef(new PermissionService()).current;

  useEffect(() => {
    setupVoice();
    setupTts();
    checkPermissions();
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      Tts.stop();
    };
  }, []);

  const setupVoice = () => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        const text = e.value[0];
        setTranscript(text);
        processCommand(text);
      }
    };
    Voice.onSpeechError = (e) => {
      console.error('Speech error:', e);
      setIsListening(false);
      setResponse('Sorry, I couldn\'t understand that. Please try again.');
    };
  };

  const setupTts = () => {
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);
  };

  const checkPermissions = async () => {
    const hasPermissions = await permissionService.checkMicrophonePermission();
    if (!hasPermissions) {
      Alert.alert(
        'Microphone Permission Required',
        'Jarvis needs microphone access to hear your commands.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => permissionService.requestMicrophonePermission() }
        ]
      );
    }
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      startPulseAnimation();
      startGlowAnimation();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('Error', 'Failed to start voice recognition');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      stopAnimations();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      })
    ).start();
  };

  const stopAnimations = () => {
    pulseAnim.setValue(1);
    glowAnim.setValue(0);
  };

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    setCommandHistory(prev => [command, ...prev.slice(0, 9)]);
    
    try {
      const result = await jarvisService.processCommand(command);
      setResponse(result);
      
      // Speak the response
      Tts.speak(result);
    } catch (error) {
      console.error('Error processing command:', error);
      setResponse('Sorry, I encountered an error processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLongPress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getGlowStyle = () => {
    return {
      shadowColor: '#00d4ff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.8],
      }),
      shadowRadius: glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
      }),
      elevation: glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10],
      }),
    };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings" size={24} color="#00d4ff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.commandsButton}
          onPress={() => navigation.navigate('VoiceCommands')}
        >
          <Icon name="list" size={24} color="#00d4ff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Jarvis Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready'}
          </Text>
        </View>

        {/* Voice Waveform */}
        <VoiceWaveform isActive={isListening} />

        {/* Main Button */}
        <View style={styles.buttonContainer}>
          <Animated.View
            style={[
              styles.mainButton,
              {
                transform: [{ scale: pulseAnim }],
                ...getGlowStyle(),
              },
            ]}
          >
            <TouchableOpacity
              style={styles.buttonTouchable}
              onLongPress={handleLongPress}
              onPress={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              activeOpacity={0.8}
            >
              <Icon
                name={isListening ? 'mic' : 'mic-none'}
                size={60}
                color={isListening ? '#00ff00' : '#ffffff'}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Transcript */}
        {transcript ? (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptLabel}>You said:</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : null}

        {/* Response */}
        {response ? (
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Jarvis:</Text>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        ) : null}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Long press to activate voice recognition
          </Text>
          <Text style={styles.instructionsText}>
            Tap once to toggle listening
          </Text>
        </View>
      </View>

      {/* Command History */}
      <CommandHistory commands={commandHistory} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  settingsButton: {
    padding: 10,
  },
  commandsButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  statusContainer: {
    marginBottom: 30,
  },
  statusText: {
    fontSize: 18,
    color: '#00d4ff',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  mainButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    borderWidth: 3,
    borderColor: '#00d4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcriptContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    width: '100%',
    maxWidth: 300,
  },
  transcriptLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  transcriptText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    width: '100%',
    maxWidth: 300,
  },
  responseLabel: {
    fontSize: 14,
    color: '#00d4ff',
    marginBottom: 5,
    fontWeight: '600',
  },
  responseText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  instructionsContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default JarvisHome;