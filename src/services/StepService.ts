import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';
import { useTodayStore } from '../stores/todayStore';
import { updateTodayRecord, getSetting, getTodayRecord } from '../db/database';
import { todayString } from '../utils/dateHelpers';
import { syncStepsFromHealth, writeStepsToHealth } from './HealthConnectService';

let subscription: ReturnType<typeof Pedometer.watchStepCount> | null = null;
let persistTimer: ReturnType<typeof setInterval> | null = null;
let currentDate = todayString();

export async function isStepCountingAvailable(): Promise<boolean> {
  const { status } = await Pedometer.requestPermissionsAsync();
  if (status !== 'granted') return false;
  return Pedometer.isAvailableAsync();
}

export async function startStepCounting(): Promise<void> {
  const available = await isStepCountingAvailable();
  if (!available) return;

  // Load today's DB record first
  const record = await getTodayRecord();
  const goal = Number(await getSetting('daily_goal')) || 10000;

  // Cold-start: try to reconcile with Health Connect / HealthKit
  // Use whichever source has more steps (sensor or health platform)
  const healthResult = await syncStepsFromHealth();
  const baselineSteps =
    healthResult.status === 'ready' && (healthResult.steps ?? 0) > record.steps
      ? (healthResult.steps ?? record.steps)
      : record.steps;

  useTodayStore.getState().setSteps(baselineSteps);
  useTodayStore.getState().setGoal(goal);

  subscription = Pedometer.watchStepCount((result) => {
    const today = todayString();
    if (today !== currentDate) {
      currentDate = today;
      useTodayStore.getState().reset();
    }
    useTodayStore.getState().addSteps(result.steps);
  });

  // Persist to SQLite every 30 seconds + sync back to Health Connect
  persistTimer = setInterval(persistToday, 30_000);
}

export function stopStepCounting(): void {
  subscription?.remove();
  subscription = null;
  if (persistTimer) {
    clearInterval(persistTimer);
    persistTimer = null;
  }
  persistToday();
}

async function persistToday(): Promise<void> {
  const { steps, distanceM, calories, goal } = useTodayStore.getState();
  await updateTodayRecord(steps, distanceM, calories, goal);
  // Best-effort write back to Health Connect so other apps see our data
  await writeStepsToHealth(steps);
}
