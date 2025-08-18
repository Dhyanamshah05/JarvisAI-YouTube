import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
}

export class VoiceService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;

  async initializeAudio(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      return true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      return false;
    }
  }

  async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        return false;
      }

      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      await this.recording.startAsync();
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording || !this.isRecording) {
        return null;
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isRecording = false;

      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  }

  // Simulated speech recognition - in a real app, you'd use a service like Google Cloud Speech-to-Text
  async recognizeSpeech(audioUri: string): Promise<VoiceRecognitionResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate random responses for demo purposes
    const mockResponses = [
      "What time is it?",
      "Hello Jarvis",
      "What's the weather like?",
      "Tell me a joke",
      "What's the date today?",
      "Thank you",
      "Goodbye",
      "How are you?",
      "Set a reminder",
      "Play some music"
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    return {
      transcript: randomResponse,
      confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7 and 1.0
    };
  }

  // Wake word detection simulation
  async detectWakeWord(audioBuffer: ArrayBuffer): Promise<boolean> {
    // In a real implementation, this would use a wake word detection library
    // like Picovoice Porcupine or similar
    return Math.random() > 0.8; // 20% chance of wake word detection for demo
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}

export default new VoiceService();