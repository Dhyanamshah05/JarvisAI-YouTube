import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface CommandHistoryProps {
  commands: string[];
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ commands }) => {
  if (commands.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Commands</Text>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {commands.map((command, index) => (
          <View key={index} style={styles.commandItem}>
            <Text style={styles.commandText} numberOfLines={2}>
              {command}
            </Text>
            <Text style={styles.timestamp}>
              {new Date().toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    paddingBottom: 20,
    maxHeight: 200,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4ff',
    textAlign: 'center',
    marginBottom: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  commandItem: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commandText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});

export default CommandHistory;