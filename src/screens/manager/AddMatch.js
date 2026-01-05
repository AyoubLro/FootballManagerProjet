import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addMatch } from '../../services/firestore';
import { addMatchOffline } from '../../services/database';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function AddMatch() {
  const navigation = useNavigation();
  const [opponent, setOpponent] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveMatch = async () => {
    if (!opponent.trim() || !location.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const matchData = {
      opponent: opponent.trim(),
      location: location.trim(),
      date: date.toISOString(),
      result: 'Upcoming',
    };

    try {
      await addMatch(matchData);
      await addMatchOffline(matchData);
      Alert.alert('Success', 'Match scheduled successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule match: ' + error.message);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Schedule New Match</Text>
      <Text style={styles.subtitle}>Add a new match to the team calendar</Text>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Match Details</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Opponent Team *" 
          value={opponent} 
          onChangeText={setOpponent}
          returnKeyType="next"
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Location * (e.g., Main Stadium)" 
          value={location} 
          onChangeText={setLocation}
          returnKeyType="done"
        />
        
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar" size={24} color="#007bff" style={styles.dateIcon} />
          <View style={styles.dateButtonContent}>
            <Text style={styles.dateButtonText}>Select Date & Time</Text>
            <Text style={styles.dateText}>{date.toLocaleString()}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveMatch}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Schedule Match</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 60,
    minHeight: '100%'
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1a1a1a', 
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center'
  },
  formSection: {
    marginBottom: 30
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20, 
    fontSize: 16, 
    backgroundColor: '#f9f9f9'
  },
  dateButton: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20, 
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateIcon: {
    marginRight: 12
  },
  dateButtonContent: {
    flex: 1
  },
  dateButtonText: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 4 
  },
  dateText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333' 
  },
  buttonContainer: {
    marginTop: 10
  },
  saveButton: { 
    backgroundColor: '#007bff', 
    padding: 18, 
    borderRadius: 10, 
    alignItems: 'center',
    marginBottom: 15
  },
  saveButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  cancelButton: { 
    backgroundColor: '#6c757d', 
    padding: 18, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  cancelButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
});