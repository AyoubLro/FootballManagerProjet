import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import PlayerNavigator from './PlayerNavigator';
import ManagerNavigator from './ManagerNavigator';
import AdminNavigator from './AdminNavigator';
import LoadingScreen from '../screens/auth/LoadingScreen';

export default function AppNavigator() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthNavigator />;
  }

  switch (role) {
    case 'admin':
      return <AdminNavigator />;
    case 'manager':
      return <ManagerNavigator />;
    case 'player':
      return <PlayerNavigator />;
    default:
      return <AuthNavigator />;
  }
}