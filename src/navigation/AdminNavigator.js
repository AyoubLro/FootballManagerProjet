import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageUsers from '../screens/admin/ManageUsers';
import SystemLogs from '../screens/admin/SystemLogs';
import ProfileScreen from '../screens/common/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Dashboard: 'bar-chart',
          Users: 'person-add',
          Logs: 'document-text',
          Profile: 'person',
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#dc3545',
      tabBarInactiveTintColor: '#8e8e93',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={AdminDashboard} />
    <Tab.Screen name="Users" component={ManageUsers} />
    <Tab.Screen name="Logs" component={SystemLogs} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}