import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import { getLogs } from '../../services/firestore';

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const logList = await getLogs();
      setLogs(logList);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.logAction}>{item.action}</Text>
      <Text style={styles.logUser}>By: {item.userEmail || 'System'}</Text>
      <Text style={styles.logTime}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading logs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Logs</Text>
      <Text style={styles.subtitle}>Recent activities and events</Text>
      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={renderLogItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No logs available</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchLogs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 25 },
  logCard: { backgroundColor: '#f8f9fa', padding: 18, borderRadius: 12, marginBottom: 12 },
  logAction: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  logUser: { fontSize: 14, color: '#666', marginBottom: 3 },
  logTime: { fontSize: 12, color: '#888' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },
  list: { paddingBottom: 30 },
});