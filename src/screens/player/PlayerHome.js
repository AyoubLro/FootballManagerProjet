import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { getMatches, getPlayers } from '../../services/firestore';
import MatchCard from '../../components/MatchCard';
import PlayerCard from '../../components/PlayerCard';

export default function PlayerHome() {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matches = await getMatches();
        setUpcomingMatches(matches.slice(0, 3));
        const players = await getPlayers();
        setTeamPlayers(players.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.welcome}>Welcome back, Player</Text>
      <Text style={styles.subtitle}>Your team overview</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        {upcomingMatches.length > 0 ? (
          upcomingMatches.map(match => <MatchCard key={match.id} match={match} />)
        ) : (
          <Text style={styles.noData}>No upcoming matches</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teammates</Text>
        {teamPlayers.length > 0 ? (
          <FlatList
            horizontal
            data={teamPlayers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <PlayerCard player={item} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <Text style={styles.noData}>No players found</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Mark Attendance for Today</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  welcome: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 25 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15, color: '#333' },
  noData: { fontSize: 16, color: '#888', fontStyle: 'italic', textAlign: 'center', padding: 20 },
  horizontalList: { paddingRight: 20 }, // Added for horizontal list
  button: { backgroundColor: '#007bff', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});