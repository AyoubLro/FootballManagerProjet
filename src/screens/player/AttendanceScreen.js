import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { getTrainingSessions } from '../../services/firestore';
import { markAttendance } from '../../services/database';

export default function AttendanceScreen() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const trainingSessions = await getTrainingSessions();
        setSessions(trainingSessions.slice(0, 5));
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    fetchSessions();
  }, []);

  const handleMarkAttendance = async (sessionId, status) => {
    await markAttendance(sessionId, 'player123', status);
    alert(`Attendance marked as ${status}`);
  };

  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.sessionType}>{item.type} • {item.time}</Text>
        <Text style={styles.sessionLocation}>📍 {item.location}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.statusButton, styles.present]} 
          onPress={() => handleMarkAttendance(item.id, 'present')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Present</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.statusButton, styles.absent]} 
          onPress={() => handleMarkAttendance(item.id, 'absent')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Absent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={sessions}
      keyExtractor={item => item.id}
      renderItem={renderSessionItem}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Training Attendance</Text>
          <Text style={styles.subtitle}>Mark your presence for upcoming sessions</Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No training sessions scheduled</Text>
          <Text style={styles.emptySubtext}>Check back later for upcoming sessions</Text>
        </View>
      }
      showsVerticalScrollIndicator={true}
    />
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1a1a1a', 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 25 
  },
  sessionCard: { 
    backgroundColor: '#f8f9fa', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionInfo: {
    flex: 1,
    marginRight: 15
  },
  sessionDate: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333',
    marginBottom: 4
  },
  sessionType: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 4
  },
  sessionLocation: { 
    fontSize: 14, 
    color: '#888' 
  },
  buttonRow: { 
    flexDirection: 'row' 
  },
  statusButton: { 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 8, 
    marginLeft: 8,
    minWidth: 70,
    alignItems: 'center'
  },
  present: { 
    backgroundColor: '#28a745' 
  },
  absent: { 
    backgroundColor: '#dc3545' 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 14
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginTop: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center'
  }
});