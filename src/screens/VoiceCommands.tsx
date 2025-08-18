import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CommandExample {
  command: string;
  description: string;
  category: string;
}

const VoiceCommands: React.FC = () => {
  const commandExamples: CommandExample[] = [
    // Time and Date
    { command: 'What time is it?', description: 'Get the current time', category: 'Time & Date' },
    { command: 'What day is it?', description: 'Get the current date and day', category: 'Time & Date' },
    { command: 'Tell me the date', description: 'Get today\'s date', category: 'Time & Date' },
    
    // Math
    { command: 'Calculate 15 plus 27', description: 'Perform basic math operations', category: 'Calculator' },
    { command: 'What is 10 times 5?', description: 'Multiplication example', category: 'Calculator' },
    { command: 'Calculate 100 divided by 4', description: 'Division example', category: 'Calculator' },
    { command: 'What is 50 minus 12?', description: 'Subtraction example', category: 'Calculator' },
    
    // Greetings
    { command: 'Hello Jarvis', description: 'Greet Jarvis', category: 'Conversation' },
    { command: 'Hi there', description: 'Another greeting', category: 'Conversation' },
    { command: 'Goodbye', description: 'Say goodbye to Jarvis', category: 'Conversation' },
    
    // Entertainment
    { command: 'Tell me a joke', description: 'Get a random joke', category: 'Entertainment' },
    { command: 'Say something funny', description: 'Request humor', category: 'Entertainment' },
    
    // Help
    { command: 'What can you do?', description: 'Learn about Jarvis capabilities', category: 'Help' },
    { command: 'Help me', description: 'Get help with Jarvis', category: 'Help' },
    { command: 'Show commands', description: 'See available commands', category: 'Help' },
    
    // Weather (placeholder)
    { command: 'What\'s the weather like?', description: 'Get weather information (requires internet)', category: 'Information' },
    { command: 'Temperature today', description: 'Check current temperature (requires internet)', category: 'Information' },
    
    // System
    { command: 'Battery level', description: 'Check device battery (requires permissions)', category: 'System' },
    { command: 'Volume up', description: 'Increase volume (requires permissions)', category: 'System' },
  ];

  const categories = ['Time & Date', 'Calculator', 'Conversation', 'Entertainment', 'Help', 'Information', 'System'];

  const renderCommandCategory = (category: string) => {
    const categoryCommands = commandExamples.filter(cmd => cmd.category === category);
    
    return (
      <View key={category} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{category}</Text>
        {categoryCommands.map((cmd, index) => (
          <View key={index} style={styles.commandExample}>
            <View style={styles.commandHeader}>
              <Icon name="mic" size={16} color="#00d4ff" />
              <Text style={styles.commandText}>"{cmd.command}"</Text>
            </View>
            <Text style={styles.commandDescription}>{cmd.description}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="lightbulb" size={24} color="#00d4ff" />
        <Text style={styles.headerTitle}>Voice Commands</Text>
      </View>
      
      <Text style={styles.headerDescription}>
        Here are some examples of commands you can use with Jarvis. Try saying them out loud!
      </Text>

      {/* Quick Start */}
      <View style={styles.quickStartSection}>
        <Text style={styles.quickStartTitle}>Quick Start</Text>
        <View style={styles.quickStartCommands}>
          <View style={styles.quickStartCommand}>
            <Icon name="schedule" size={20} color="#00d4ff" />
            <Text style={styles.quickStartText}>"What time is it?"</Text>
          </View>
          <View style={styles.quickStartCommand}>
            <Icon name="calculate" size={20} color="#00d4ff" />
            <Text style={styles.quickStartText}>"Calculate 10 plus 5"</Text>
          </View>
          <View style={styles.quickStartCommand}>
            <Icon name="sentiment-satisfied" size={20} color="#00d4ff" />
            <Text style={styles.quickStartText}>"Tell me a joke"</Text>
          </View>
        </View>
      </View>

      {/* All Commands by Category */}
      <View style={styles.commandsSection}>
        <Text style={styles.commandsTitle}>All Commands</Text>
        {categories.map(renderCommandCategory)}
      </View>

      {/* Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Tips for Better Recognition</Text>
        <View style={styles.tipItem}>
          <Icon name="check-circle" size={16} color="#00ff00" />
          <Text style={styles.tipText}>Speak clearly and at a normal pace</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="check-circle" size={16} color="#00ff00" />
          <Text style={styles.tipText}>Reduce background noise when possible</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="check-circle" size={16} color="#00ff00" />
          <Text style={styles.tipText}>Hold your device close to your mouth</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="check-circle" size={16} color="#00ff00" />
          <Text style={styles.tipText}>Use natural language - be conversational</Text>
        </View>
      </View>

      {/* Advanced Features */}
      <View style={styles.advancedSection}>
        <Text style={styles.advancedTitle}>Advanced Features</Text>
        <View style={styles.advancedFeature}>
          <Icon name="psychology" size={20} color="#00d4ff" />
          <View style={styles.advancedFeatureText}>
            <Text style={styles.advancedFeatureTitle}>AI-Powered Responses</Text>
            <Text style={styles.advancedFeatureDescription}>
              Add your OpenAI API key in Settings to enable intelligent, contextual responses to any question.
            </Text>
          </View>
        </View>
        <View style={styles.advancedFeature}>
          <Icon name="wake-word" size={20} color="#00d4ff" />
          <View style={styles.advancedFeatureText}>
            <Text style={styles.advancedFeatureTitle}>Wake Word Detection</Text>
            <Text style={styles.advancedFeatureDescription}>
              Enable wake word detection to activate Jarvis hands-free (coming soon).
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#00d4ff',
    marginLeft: 10,
  },
  headerDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickStartSection: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  quickStartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  quickStartCommands: {
    gap: 12,
  },
  quickStartCommand: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
  },
  quickStartText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
    fontStyle: 'italic',
  },
  commandsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  commandsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 15,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  commandExample: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  commandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commandText: {
    fontSize: 16,
    color: '#00d4ff',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  commandDescription: {
    fontSize: 14,
    color: '#888',
    marginLeft: 24,
  },
  tipsSection: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 10,
  },
  advancedSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  advancedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: 15,
  },
  advancedFeature: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  advancedFeatureText: {
    flex: 1,
    marginLeft: 15,
  },
  advancedFeatureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  advancedFeatureDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
});

export default VoiceCommands;