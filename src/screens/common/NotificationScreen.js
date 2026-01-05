import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import { schedulePushNotification } from '../../services/notifications';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      setNotifications(scheduled);
    };
    fetchNotifications();
  }, []);

  const toggleNotifications = (value) => {
    setEnabled(value);
    if (!value) {
      Notifications.cancelAllScheduledNotificationsAsync();
    } else {
      schedulePushNotification('Notifications enabled', 'You will receive match reminders');
    }
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.content.title}</Text>
      <Text style={styles.notificationBody}>{item.content.body}</Text>
      <Text style={styles.notificationTime}>{new Date(item.trigger.value).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Enable Match Reminders</Text>
        <Switch value={enabled} onValueChange={toggleNotifications} />
      </View>

      <Text style={styles.sectionTitle}>Scheduled Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.identifier}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No scheduled notifications</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 25 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20, borderRadius: 12, marginBottom: 30 },
  toggleLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 15 },
  notificationCard: { backgroundColor: '#f8f9fa', padding: 18, borderRadius: 12, marginBottom: 12 },
  notificationTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  notificationBody: { fontSize: 14, color: '#666', marginBottom: 5 },
  notificationTime: { fontSize: 12, color: '#888' },
  list: { paddingBottom: 30 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20, fontSize: 16 },
});