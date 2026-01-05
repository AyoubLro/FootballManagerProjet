import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getUsers, updateUserRole } from '../../services/firestore';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userList = await getUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    Alert.alert(
      'Change User Role',
      `Are you sure you want to change this user's role to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await updateUserRole(userId, newRole);
              Alert.alert('Success', `User role changed to ${newRole}`);
              setUsers(users.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
              ));
            } catch (error) {
              Alert.alert('Error', 'Failed to update user role');
            }
          }
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name ? item.name.charAt(0).toUpperCase() : item.email.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name || 'No Name'}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}>
            <Text style={styles.roleBadgeText}>{item.role}</Text>
          </View>
        </View>
      </View>
      <View style={styles.roleButtons}>
        <TouchableOpacity 
          style={[styles.roleButton, item.role === 'player' && styles.activeRole]} 
          onPress={() => handleUpdateUserRole(item.id, 'player')}
        >
          <Text style={styles.roleButtonText}>Player</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleButton, item.role === 'manager' && styles.activeRole]} 
          onPress={() => handleUpdateUserRole(item.id, 'manager')}
        >
          <Text style={styles.roleButtonText}>Manager</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleButton, item.role === 'admin' && styles.activeRole]} 
          onPress={() => handleUpdateUserRole(item.id, 'admin')}
        >
          <Text style={styles.roleButtonText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getRoleColor = (role) => {
    const colors = { 
      admin: '#dc3545', 
      manager: '#28a745', 
      player: '#007bff' 
    };
    return colors[role] || '#6c757d';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      <Text style={styles.subtitle}>{users.length} registered users</Text>
      
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchUsers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 25 },
  userCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 12, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#007bff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userDetails: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  userEmail: { fontSize: 14, color: '#666', marginBottom: 5 },
  roleBadge: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  roleBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  roleButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10
  },
  roleButton: { 
    backgroundColor: '#e9ecef', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center'
  },
  activeRole: { backgroundColor: '#007bff' },
  roleButtonText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#333' 
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 40 
  },
  emptyText: { 
    fontSize: 16, 
    color: '#888', 
    textAlign: 'center' 
  },
  list: { paddingBottom: 30 },
});