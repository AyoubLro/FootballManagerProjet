import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addPlayer } from '../../services/firestore';
import { addPlayerOffline } from '../../services/database';
import { useNavigation } from '@react-navigation/native';

export default function EditPlayer() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Forward');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = async () => {
    if (!name || !phone || !email) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const player = { name, position, phone, email };
    
    try {
      // Save to Firestore
      await addPlayer(player);
      // Also save locally for offline access
      await addPlayerOffline(player);
      Alert.alert('Success', 'Player added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save player: ' + error.message);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Add / Edit Player</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Full Name *" 
        value={name} 
        onChangeText={setName} 
        returnKeyType="next"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Phone Number *" 
        value={phone} 
        onChangeText={setPhone} 
        keyboardType="phone-pad"
        returnKeyType="next"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Email *" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none"
        returnKeyType="done"
      />
      
      <Text style={styles.label}>Position</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={position} onValueChange={setPosition}>
          <Picker.Item label="Goalkeeper" value="Goalkeeper" />
          <Picker.Item label="Defender" value="Defender" />
          <Picker.Item label="Midfielder" value="Midfielder" />
          <Picker.Item label="Forward" value="Forward" />
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Player</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
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
    marginBottom: 25,
    textAlign: 'center'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    fontSize: 16, 
    backgroundColor: '#f9f9f9'
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 10, 
    color: '#333' 
  },
  pickerContainer: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    marginBottom: 30, 
    backgroundColor: '#f9f9f9',
    overflow: 'hidden'
  },
  buttonContainer: {
    marginTop: 10
  },
  saveButton: { 
    backgroundColor: '#28a745', 
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