import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/auth';

export default function ProfileScreen() {
  const { user, role } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logoutUser() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.email}</Text>
        <Text style={styles.roleBadge}>{role?.toUpperCase()}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID</Text>
          <Text style={styles.infoValue}>{user?.uid?.substring(0, 10)}...</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>{role}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: '600', color: '#333', marginBottom: 10 },
  roleBadge: { backgroundColor: '#28a745', color: '#fff', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, fontSize: 14, fontWeight: '600' },
  infoSection: { backgroundColor: '#f8f9fa', padding: 20, borderRadius: 12, marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  infoLabel: { fontSize: 16, color: '#666' },
  infoValue: { fontSize: 16, color: '#333', fontWeight: '500' },
  logoutButton: { backgroundColor: '#dc3545', padding: 18, borderRadius: 10, alignItems: 'center' },
  logoutButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});