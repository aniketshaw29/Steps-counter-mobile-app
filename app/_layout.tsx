import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSettingsStore } from '../src/stores/settingsStore';
import { useTodayStore } from '../src/stores/todayStore';
import { startStepCounting, stopStepCounting } from '../src/services/StepService';
import { recalculateStreak, getSetting, setSetting } from '../src/db/database';

export default function RootLayout() {
  const loadSettings = useSettingsStore((s) => s.load);
  const setGoal = useTodayStore((s) => s.setGoal);
  const setStreakCount = useSettingsStore((s) => s.setStreakCount);
  const dailyGoal = useSettingsStore((s) => s.dailyGoal);
  const [initialRoute, setInitialRoute] = useState<'onboarding' | '(tabs)' | null>(null);

  useEffect(() => {
    (async () => {
      await loadSettings();
      const onboardingDone = await getSetting('onboarding_complete');

      if (onboardingDone !== 'true') {
        setInitialRoute('onboarding');
      } else {
        setInitialRoute('(tabs)');
        setGoal(dailyGoal);
        const streak = await recalculateStreak();
        setStreakCount(streak);
        await startStepCounting();
      }
    })();

    return () => { stopStepCounting(); };
  }, []);

  if (!initialRoute) return null;

  return (
    <Stack initialRouteName={initialRoute}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
