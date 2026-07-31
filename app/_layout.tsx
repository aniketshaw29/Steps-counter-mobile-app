import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSettingsStore } from '../src/stores/settingsStore';
import { useTodayStore } from '../src/stores/todayStore';
import { startStepCounting, stopStepCounting } from '../src/services/StepService';
import { recalculateStreak } from '../src/db/database';

export default function RootLayout() {
  const loadSettings = useSettingsStore((s) => s.load);
  const setGoal = useTodayStore((s) => s.setGoal);
  const setStreakCount = useSettingsStore((s) => s.setStreakCount);
  const dailyGoal = useSettingsStore((s) => s.dailyGoal);

  useEffect(() => {
    (async () => {
      await loadSettings();
      setGoal(dailyGoal);
      const streak = await recalculateStreak();
      setStreakCount(streak);
      await startStepCounting();
    })();

    return () => {
      stopStepCounting();
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
