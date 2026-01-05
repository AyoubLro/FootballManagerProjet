import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList } from 'react-native';
import { getPlayers } from '../../services/firestore';
import PlayerCard from '../../components/PlayerCard';

export default function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playerList = await getPlayers();
        setPlayers(playerList);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  return (
    <FlatList
      data={players}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PlayerCard player={item} detailed />}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Team Roster</Text>
          <Text style={styles.count}>{players.length} Players</Text>
        </>
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
  count: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 20 
  },
});