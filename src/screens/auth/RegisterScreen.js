import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { registerUser } from '../../services/auth';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('player');

  const handleRegister = async () => {
    try {
      await registerUser(email, password, { name, role });
      Alert.alert('Success', 'Account created successfully');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the football team management</Text>
      
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Role</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={role} onValueChange={setRole} style={styles.picker}>
            <Picker.Item label="Player" value="player" />
            <Picker.Item label="Manager" value="manager" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#007bff' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  pickerContainer: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: '#333' },
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, overflow: 'hidden' },
  picker: { height: 50, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: '#28a745', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { marginTop: 20, textAlign: 'center', color: '#007bff', fontSize: 16 },
});