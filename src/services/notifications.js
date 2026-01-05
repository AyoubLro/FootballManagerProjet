import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { saveNotificationOffline } from './database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Must use physical device for push notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for notifications');
    return null;
  }
  
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push token:', token);
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }
  
  return token;
};

export const scheduleMatchNotification = async (match, triggerSeconds = 86400) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏆 Match Reminder',
        body: `Don't forget: ${match.opponent} at ${match.location}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'match', matchId: match.id },
      },
      trigger: { seconds: triggerSeconds },
    });

    await saveNotificationOffline({
      title: 'Match Reminder',
      body: `Upcoming match vs ${match.opponent}`,
      type: 'match',
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

export const scheduleTrainingNotification = async (training, triggerSeconds = 3600) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚽ Training Session',
        body: `Training at ${training.location} in 1 hour`,
        sound: true,
        data: { type: 'training', trainingId: training.id },
      },
      trigger: { seconds: triggerSeconds },
    });

    await saveNotificationOffline({
      title: 'Training Reminder',
      body: `Training session at ${training.location}`,
      type: 'training',
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling training notification:', error);
  }
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

export const presentLocalNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: { seconds: 1 },
  });
};

export const setNotificationCategories = () => {
  if (Platform.OS === 'ios') {
    Notifications.setNotificationCategoryAsync('match_reminder', [
      {
        identifier: 'view_match',
        buttonTitle: 'View Match',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'Dismiss',
        options: { isDestructive: true },
      },
    ]);
  }
};