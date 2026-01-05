import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList } from 'react-native';
import { getMatches } from '../../services/firestore';
import MatchCard from '../../components/MatchCard';

export default function MatchCalendar() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchList = await getMatches();
        setMatches(matchList.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };
    fetchMatches();
  }, []);

  return (
    <FlatList
      data={matches}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <MatchCard match={item} />}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Match Calendar</Text>
          <Text style={styles.subtitle}>Upcoming and past matches</Text>
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
  subtitle: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 20 
  },
});