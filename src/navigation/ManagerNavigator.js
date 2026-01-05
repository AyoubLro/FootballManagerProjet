import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ManagerHome from '../screens/manager/ManagerHome';
import EditPlayer from '../screens/manager/EditPlayer';
import FormationBuilder from '../screens/manager/FormationBuilder';
import AddMatch from '../screens/manager/AddMatch';
import ProfileScreen from '../screens/common/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ManagerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Dashboard: 'stats-chart',
          Players: 'people',
          Formation: 'football',
          Matches: 'calendar',
          Profile: 'person',
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#28a745',
      tabBarInactiveTintColor: '#8e8e93',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={ManagerHome} />
    <Tab.Screen name="Players" component={EditPlayer} />
    <Tab.Screen name="Formation" component={FormationBuilder} />
    <Tab.Screen name="Matches" component={AddMatch} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function ManagerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManagerTabs" component={ManagerTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}