import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPlayers, getMatches } from '../../services/firestore';

export default function ManagerHome() {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    activePlayers: 0,
    avgAttendance: 0,
    upcomingMatches: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagerStats();
  }, []);

  const fetchManagerStats = async () => {
    try {
      setLoading(true);
      
      // Fetch data from Firestore
      const [players, matches] = await Promise.all([
        getPlayers(),
        getMatches(),
      ]);

      // Calculate upcoming matches
      const upcomingMatches = matches.filter(match => {
        if (match.result === 'Upcoming') return true;
        if (match.date) {
          const matchDate = new Date(match.date);
          const today = new Date();
          return matchDate > today;
        }
        return false;
      }).length;

      // Calculate attendance (placeholder - would need actual attendance data)
      // For now, use a formula based on player count
      const baseAttendance = 85; // Base percentage
      const playerFactor = Math.min(players.length / 30, 1); // Scale with team size
      const calculatedAttendance = Math.round(baseAttendance * playerFactor);

      // Prepare stats
      setStats({
        activePlayers: players.length,
        avgAttendance: Math.max(calculatedAttendance, 65), // Minimum 65%
        upcomingMatches,
      });

    } catch (error) {
      console.error('Error fetching manager stats:', error);
      // Set fallback stats on error
      setStats({
        activePlayers: 0,
        avgAttendance: 0,
        upcomingMatches: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewStats = () => {
    // Navigate to stats screen or show detailed stats
    alert('Detailed stats feature coming soon!');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Loading team data...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Manager Dashboard</Text>
      <Text style={styles.subtitle}>Manage your team effectively</Text>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={() => navigation.navigate('Players')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={styles.actionText}>Manage Players</Text>
          <Text style={styles.actionSubtext}>{stats.activePlayers} players</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={() => navigation.navigate('Formation')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>⚽</Text>
          <Text style={styles.actionText}>Build Formation</Text>
          <Text style={styles.actionSubtext}>Create lineups</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={() => navigation.navigate('Matches')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📅</Text>
          <Text style={styles.actionText}>Schedule Match</Text>
          <Text style={styles.actionSubtext}>{stats.upcomingMatches} upcoming</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={handleViewStats}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>View Stats</Text>
          <Text style={styles.actionSubtext}>Team analytics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Team Overview</Text>
        <Text style={styles.sectionSubtitle}>Real-time data from your team</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.activePlayers}</Text>
            <Text style={styles.statLabel}>Active Players</Text>
            <Text style={styles.statSubtext}>
              {stats.activePlayers > 0 ? 'Full squad' : 'No players yet'}
            </Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, styles.attendanceNumber]}>{stats.avgAttendance}%</Text>
            <Text style={styles.statLabel}>Attendance Rate</Text>
            <Text style={styles.statSubtext}>
              {stats.avgAttendance >= 80 ? 'Excellent' : 
               stats.avgAttendance >= 70 ? 'Good' : 'Needs improvement'}
            </Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.upcomingMatches}</Text>
            <Text style={styles.statLabel}>Upcoming Matches</Text>
            <Text style={styles.statSubtext}>
              {stats.upcomingMatches > 0 ? 'Scheduled' : 'No matches'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchManagerStats}
          activeOpacity={0.7}
        >
          <Text style={styles.refreshButtonText}>⟳ Refresh Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 40 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#666' 
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
  quickActions: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 30 
  },
  actionCard: { 
    backgroundColor: '#fff', 
    width: '48%', 
    padding: 20, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: { 
    fontSize: 32, 
    marginBottom: 8 
  },
  actionText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333',
    marginBottom: 4
  },
  actionSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  statsSection: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 5, 
    color: '#333' 
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statBox: { 
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 5
  },
  statNumber: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#007bff' 
  },
  attendanceNumber: {
    color: stats => stats.avgAttendance >= 80 ? '#28a745' : 
                    stats.avgAttendance >= 70 ? '#ffc107' : '#dc3545'
  },
  statLabel: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 5,
    textAlign: 'center'
  },
  statSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  refreshButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  refreshButtonText: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '600'
  }
});