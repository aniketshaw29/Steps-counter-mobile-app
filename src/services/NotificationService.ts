import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleGoalReminder(hourHH: number, minuteMM: number): Promise<void> {
  // Cancel any existing daily reminder before scheduling a new one
  await cancelGoalReminder();

  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-reminder',
    content: {
      title: "Time to move! 🚶",
      body: "Check how many steps you've taken today.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hourHH,
      minute: minuteMM,
    },
  });
}

export async function cancelGoalReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('daily-reminder');
}

export async function sendGoalReachedNotification(steps: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    identifier: 'goal-reached',
    content: {
      title: "Goal reached! 🎉",
      body: `You've walked ${steps.toLocaleString()} steps today. Amazing!`,
      sound: true,
    },
    trigger: null, // fire immediately
  });
}

export async function sendStreakNotification(streak: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    identifier: 'streak-milestone',
    content: {
      title: `${streak}-day streak! 🔥`,
      body: `You've hit your goal ${streak} days in a row. Keep going!`,
      sound: true,
    },
    trigger: null,
  });
}
