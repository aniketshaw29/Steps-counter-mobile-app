import * as Notifications from 'expo-notifications';

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
  await Notifications.cancelScheduledNotificationAsync('daily-reminder').catch(() => {});
}

export async function sendGoalReachedNotification(steps: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    identifier: 'goal-reached',
    content: {
      title: "Goal reached! 🎉",
      body: `You've walked ${steps.toLocaleString()} steps today. Amazing!`,
      sound: true,
    },
    trigger: null,
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

// Schedule an inactivity nudge: fires N minutes from now if steps haven't updated
export async function scheduleInactivityNudge(delayMinutes = 120): Promise<void> {
  await cancelInactivityNudge();
  await Notifications.scheduleNotificationAsync({
    identifier: 'inactivity-nudge',
    content: {
      title: "Time to get up! 🧍",
      body: "You've been sitting for a while. Even a short walk helps.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: delayMinutes * 60,
      repeats: false,
    },
  });
}

export async function cancelInactivityNudge(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('inactivity-nudge').catch(() => {});
}

export async function scheduleWeeklySummary(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('weekly-summary').catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: 'weekly-summary',
    content: {
      title: "Weekly summary 📊",
      body: "Check how many steps you walked this week!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1,   // Sunday (1 = Sunday in Expo's system)
      hour: 20,
      minute: 0,
    },
  });
}
