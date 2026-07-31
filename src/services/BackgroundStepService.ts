import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Pedometer } from 'expo-sensors';
import { updateTodayRecord, getTodayRecord, getSetting } from '../db/database';
import { todayString } from '../utils/dateHelpers';
import { stepsToDistanceM, stepsToCalories } from '../utils/calculations';

export const BACKGROUND_STEP_TASK = 'background-step-count';

// Register the background task — must be called at the top level (not inside a component)
TaskManager.defineTask(BACKGROUND_STEP_TASK, async () => {
  try {
    const today = todayString();
    const record = await getTodayRecord();
    const goal = Number(await getSetting('daily_goal')) || 10000;

    // On iOS, query CMPedometer for steps since midnight
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await Pedometer.getStepCountAsync(startOfDay, new Date());
    if (!result) return BackgroundFetch.BackgroundFetchResult.NoData;

    const steps = result.steps;
    const distanceM = stepsToDistanceM(steps);
    const calories = stepsToCalories(steps);

    await updateTodayRecord(steps, distanceM, calories, goal);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundStepTask(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK);
    if (isRegistered) return;

    await BackgroundFetch.registerTaskAsync(BACKGROUND_STEP_TASK, {
      minimumInterval: 15 * 60,  // 15 minutes (minimum allowed by OS)
      stopOnTerminate: false,     // keep running after app is closed (Android)
      startOnBoot: true,          // restart after device reboot (Android)
    });
  } catch {
    // Background fetch not available on all devices/Expo Go — silently skip
  }
}

export async function unregisterBackgroundStepTask(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK);
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_STEP_TASK);
    }
  } catch {}
}
