import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ allowedRoles, children }) => {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Access Denied</Text>
        <Text style={styles.subtext}>You don't have permission to view this page.</Text>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  text: { fontSize: 24, fontWeight: 'bold', color: '#dc3545', marginBottom: 10 },
  subtext: { fontSize: 16, color: '#666', textAlign: 'center' },
});

export default RoleGuard;