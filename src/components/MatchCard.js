import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const MatchCard = ({ match }) => {
  const getResultColor = (result) => {
    if (result === 'Win') return '#28a745';
    if (result === 'Loss') return '#dc3545';
    if (result === 'Draw') return '#ffc107';
    return '#6c757d';
  };

  return (
    <View style={styles.card}>
      <View style={styles.matchHeader}>
        <Text style={styles.opponent}>vs {match.opponent}</Text>
        <View style={[styles.resultBadge, { backgroundColor: getResultColor(match.result) }]}>
          <Text style={styles.resultText}>{match.result}</Text>
        </View>
      </View>
      <Text style={styles.date}>📅 {new Date(match.date).toLocaleDateString()}</Text>
      <Text style={styles.location}>📍 {match.location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 3 },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  opponent: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  resultBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  resultText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  date: { fontSize: 16, color: '#666', marginBottom: 5 },
  location: { fontSize: 16, color: '#666' },
});

export default MatchCard;