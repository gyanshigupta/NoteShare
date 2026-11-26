import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NoteDetailsScreen from '../screens/NoteDetailsScreen';
import { useApp } from '../services/AppContext';
import { COLORS } from '../services/theme';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

const NOTE_SHARE_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.border,
    notification: COLORS.primary,
  },
};

export default function RootNavigator() {
  const { isAuthenticated } = useApp();

  return (
    <NavigationContainer theme={NOTE_SHARE_THEME}>
      {isAuthenticated ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="NoteDetails" component={NoteDetailsScreen} />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
