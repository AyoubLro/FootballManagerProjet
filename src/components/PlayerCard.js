import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlayerCard = ({ player, detailed = false }) => {
  const positionColors = {
    Goalkeeper: '#dc3545',
    Defender: '#007bff',
    Midfielder: '#28a745',
    Forward: '#ffc107',
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.positionBadge, { backgroundColor: positionColors[player.position] || '#6c757d' }]}>
          <Text style={styles.positionText}>{player.position?.charAt(0)}</Text>
        </View>
        <Text style={styles.playerName}>{player.name}</Text>
        <TouchableOpacity>
          <Ionicons name="call" size={20} color="#007bff" />
        </TouchableOpacity>
      </View>
      
      {detailed && (
        <View style={styles.details}>
          <Text style={styles.detailText}>📞 {player.phone}</Text>
          <Text style={styles.detailText}>✉️ {player.email}</Text>
          <Text style={styles.detailText}>⚽ {player.position}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 15, elevation: 3, minWidth: 200, marginRight: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  positionBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  positionText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  playerName: { flex: 1, fontSize: 18, fontWeight: '600', color: '#333' },
  details: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  detailText: { fontSize: 14, color: '#666', marginBottom: 6 },
});

export default PlayerCard;