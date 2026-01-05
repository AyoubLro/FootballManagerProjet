import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import PlayerHome from '../screens/player/PlayerHome';
import PlayerList from '../screens/player/PlayerList';
import MatchCalendar from '../screens/player/MatchCalendar';
import AttendanceScreen from '../screens/player/AttendanceScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import NotificationScreen from '../screens/common/NotificationScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home: 'home',
          Players: 'people',
          Calendar: 'calendar',
          Attendance: 'checkmark-circle',
          Profile: 'person',
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: '#8e8e93',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={PlayerHome} />
    <Tab.Screen name="Players" component={PlayerList} />
    <Tab.Screen name="Calendar" component={MatchCalendar} />
    <Tab.Screen name="Attendance" component={AttendanceScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function PlayerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PlayerTabs" component={PlayerTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
    </Stack.Navigator>
  );
}