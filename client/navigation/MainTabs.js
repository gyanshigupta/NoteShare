import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BookmarksScreen from '../screens/BookmarksScreen';
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UploadScreen from '../screens/UploadScreen';
import { COLORS } from '../services/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Explore: { focused: 'compass', unfocused: 'compass-outline' },
  Upload: { focused: 'add-circle', unfocused: 'add-circle-outline' },
  Bookmarks: { focused: 'bookmark', unfocused: 'bookmark-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 56 + bottomInset,
            paddingBottom: bottomInset,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          const iconPair = TAB_ICONS[route.name] || TAB_ICONS.Home;
          const iconName = focused ? iconPair.focused : iconPair.unfocused;
          return (
            <Ionicons
              name={iconName}
              size={route.name === 'Upload' ? size + 2 : size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
