import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import JarvisHome from './src/screens/JarvisHome';
import Settings from './src/screens/Settings';
import VoiceCommands from './src/screens/VoiceCommands';

export type RootStackParamList = {
  JarvisHome: undefined;
  Settings: undefined;
  VoiceCommands: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="JarvisHome"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1a1a1a',
              },
              headerTintColor: '#00d4ff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="JarvisHome" 
              component={JarvisHome} 
              options={{ title: 'Jarvis Assistant' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={Settings} 
              options={{ title: 'Settings' }}
            />
            <Stack.Screen 
              name="VoiceCommands" 
              component={VoiceCommands} 
              options={{ title: 'Voice Commands' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;