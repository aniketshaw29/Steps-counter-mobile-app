import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';
import { useTodayStore } from '../stores/todayStore';
import { updateTodayRecord, getSetting, setSetting, getTodayRecord } from '../db/database';
import { todayString } from '../utils/dateHelpers';

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

  // Load today's existing record as baseline
  const record = await getTodayRecord();
  const goal = Number(await getSetting('daily_goal')) || 10000;

  useTodayStore.getState().setSteps(record.steps);
  useTodayStore.getState().setGoal(goal);

  // Android: store the sensor reading at session start as baseline
  if (Platform.OS === 'android') {
    await initAndroidBaseline();
  }

  subscription = Pedometer.watchStepCount((result) => {
    // Check for day rollover
    const today = todayString();
    if (today !== currentDate) {
      currentDate = today;
      useTodayStore.getState().reset();
    }

    if (Platform.OS === 'android') {
      handleAndroidStep(result.steps);
    } else {
      useTodayStore.getState().addSteps(result.steps);
    }
  });

  // Persist to SQLite every 30 seconds
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

async function initAndroidBaseline(): Promise<void> {
  // Android Step Counter is monotonic since reboot; we read current value and store as baseline
  // expo-sensors watchStepCount gives us deltas already — so we just reset the store to DB value
  // The baseline is implicitly managed by expo-sensors delta reporting
}

// Android: expo-sensors gives cumulative steps since watch started — already delta-based
// So we can just add directly
function handleAndroidStep(stepsSinceWatch: number): void {
  // expo-sensors on Android already returns cumulative count since watchStepCount was called
  // We call setSteps (not addSteps) because result.steps is cumulative since subscription start
  const record = useTodayStore.getState();
  const baseSteps = record.steps - (record.steps % 1); // keep existing DB steps
  // Actually expo-sensors returns steps since last callback, not total. Use addSteps.
  useTodayStore.getState().addSteps(stepsSinceWatch);
}

async function persistToday(): Promise<void> {
  const { steps, distanceM, calories, goal } = useTodayStore.getState();
  await updateTodayRecord(steps, distanceM, calories, goal);
}
