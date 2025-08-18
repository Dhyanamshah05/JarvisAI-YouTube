import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionService } from '../services/PermissionService';

const Settings: React.FC = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [permissions, setPermissions] = useState({
    microphone: false,
    storage: false,
    notifications: false,
  });

  const permissionService = new PermissionService();

  useEffect(() => {
    loadSettings();
    checkPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      const savedApiKey = await AsyncStorage.getItem('openai_api_key');
      const savedVoiceEnabled = await AsyncStorage.getItem('voice_enabled');
      const savedTtsEnabled = await AsyncStorage.getItem('tts_enabled');
      const savedWakeWordEnabled = await AsyncStorage.getItem('wake_word_enabled');

      if (savedApiKey) setOpenaiApiKey(savedApiKey);
      if (savedVoiceEnabled !== null) setVoiceEnabled(JSON.parse(savedVoiceEnabled));
      if (savedTtsEnabled !== null) setTtsEnabled(JSON.parse(savedTtsEnabled));
      if (savedWakeWordEnabled !== null) setWakeWordEnabled(JSON.parse(savedWakeWordEnabled));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const checkPermissions = async () => {
    const perms = await permissionService.checkAllPermissions();
    setPermissions(perms);
  };

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem('openai_api_key', openaiApiKey);
      Alert.alert('Success', 'API key saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const saveVoiceEnabled = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('voice_enabled', JSON.stringify(value));
      setVoiceEnabled(value);
    } catch (error) {
      console.error('Error saving voice setting:', error);
    }
  };

  const saveTtsEnabled = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('tts_enabled', JSON.stringify(value));
      setTtsEnabled(value);
    } catch (error) {
      console.error('Error saving TTS setting:', error);
    }
  };

  const saveWakeWordEnabled = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('wake_word_enabled', JSON.stringify(value));
      setWakeWordEnabled(value);
    } catch (error) {
      console.error('Error saving wake word setting:', error);
    }
  };

  const requestPermission = async (permissionType: 'microphone' | 'storage' | 'notifications') => {
    let granted = false;
    
    switch (permissionType) {
      case 'microphone':
        granted = await permissionService.requestMicrophonePermission();
        break;
      case 'storage':
        granted = await permissionService.requestStoragePermission();
        break;
      case 'notifications':
        granted = await permissionService.requestNotificationPermission();
        break;
    }

    if (granted) {
      checkPermissions();
      Alert.alert('Success', `${permissionType} permission granted!`);
    }
  };

  const clearApiKey = () => {
    Alert.alert(
      'Clear API Key',
      'Are you sure you want to clear your OpenAI API key?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('openai_api_key');
              setOpenaiApiKey('');
              Alert.alert('Success', 'API key cleared successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear API key');
            }
          },
        },
      ]
    );
  };

  const renderPermissionItem = (
    title: string,
    description: string,
    permissionType: 'microphone' | 'storage' | 'notifications',
    icon: string
  ) => (
    <View style={styles.permissionItem}>
      <View style={styles.permissionInfo}>
        <Icon name={icon} size={24} color="#00d4ff" style={styles.permissionIcon} />
        <View style={styles.permissionText}>
          <Text style={styles.permissionTitle}>{title}</Text>
          <Text style={styles.permissionDescription}>{description}</Text>
        </View>
      </View>
      <View style={styles.permissionAction}>
        {permissions[permissionType] ? (
          <View style={styles.grantedBadge}>
            <Icon name="check" size={16} color="#00ff00" />
            <Text style={styles.grantedText}>Granted</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => requestPermission(permissionType)}
          >
            <Text style={styles.requestButtonText}>Request</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* API Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Configuration</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>OpenAI API Key</Text>
          <TextInput
            style={styles.textInput}
            value={openaiApiKey}
            onChangeText={setOpenaiApiKey}
            placeholder="Enter your OpenAI API key"
            placeholderTextColor="#666"
            secureTextEntry
          />
          <View style={styles.apiKeyActions}>
            <TouchableOpacity style={styles.saveButton} onPress={saveApiKey}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearApiKey}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.helpText}>
          Add your OpenAI API key to enable AI-powered responses. Without it, Jarvis will use offline commands only.
        </Text>
      </View>

      {/* Voice Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="mic" size={24} color="#00d4ff" />
            <Text style={styles.settingTitle}>Voice Recognition</Text>
          </View>
          <Switch
            value={voiceEnabled}
            onValueChange={saveVoiceEnabled}
            trackColor={{ false: '#444', true: '#00d4ff' }}
            thumbColor={voiceEnabled ? '#ffffff' : '#888'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="volume-up" size={24} color="#00d4ff" />
            <Text style={styles.settingTitle}>Text-to-Speech</Text>
          </View>
          <Switch
            value={ttsEnabled}
            onValueChange={saveTtsEnabled}
            trackColor={{ false: '#444', true: '#00d4ff' }}
            thumbColor={ttsEnabled ? '#ffffff' : '#888'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="wake-word" size={24} color="#00d4ff" />
            <Text style={styles.settingTitle}>Wake Word Detection</Text>
          </View>
          <Switch
            value={wakeWordEnabled}
            onValueChange={saveWakeWordEnabled}
            trackColor={{ false: '#444', true: '#00d4ff' }}
            thumbColor={wakeWordEnabled ? '#ffffff' : '#888'}
          />
        </View>
      </View>

      {/* Permissions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        
        {renderPermissionItem(
          'Microphone',
          'Required for voice recognition',
          'microphone',
          'mic'
        )}
        
        {renderPermissionItem(
          'Storage',
          'Required for saving settings and data',
          'storage',
          'storage'
        )}
        
        {renderPermissionItem(
          'Notifications',
          'Required for alerts and reminders',
          'notifications',
          'notifications'
        )}
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Platform</Text>
          <Text style={styles.aboutValue}>{Platform.OS}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  apiKeyActions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
  },
  saveButtonText: {
    color: '#000000',
    textAlign: 'center',
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
  },
  clearButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 15,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  permissionIcon: {
    marginRight: 15,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#888',
  },
  permissionAction: {
    alignItems: 'flex-end',
  },
  grantedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  grantedText: {
    color: '#00ff00',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  requestButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  requestButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  aboutLabel: {
    fontSize: 16,
    color: '#ffffff',
  },
  aboutValue: {
    fontSize: 16,
    color: '#888',
  },
});

export default Settings;