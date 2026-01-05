import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/utils/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from './src/services/database';

export default function App() {
  useEffect(() => {
    // Initialize database when app starts
    initDatabase().then(() => {
      console.log('Database initialized successfully');
    }).catch((error) => {
      console.error('Failed to initialize database:', error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}