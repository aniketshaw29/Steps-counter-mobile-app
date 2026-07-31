// Health Connect / HealthKit integration
// Uses expo-sensors Pedometer for reading steps from the health platform.
// Full expo-health SDK integration is planned for Phase 7 when the package
// reaches stable API on both Android (Health Connect) and iOS (HealthKit).
//
// Current approach: expo-sensors Pedometer already reads from the OS health
// store on both platforms — iOS reads from CMPedometer (backed by HealthKit),
// Android reads from TYPE_STEP_COUNTER (hardware sensor, can sync to Health Connect).
//
// This file provides helpers for future full Health Connect integration.

import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export interface HealthStepsResult {
  steps: number;
  source: 'pedometer' | 'unavailable';
}

// Read steps for a given date range from the platform health store (iOS only via CMPedometer)
export async function readStepsFromHealth(start: Date, end: Date): Promise<HealthStepsResult> {
  if (Platform.OS !== 'ios') {
    // Android: TYPE_STEP_COUNTER doesn't support historical queries.
    // Health Connect API requires the full expo-health package — planned Phase 7.
    return { steps: 0, source: 'unavailable' };
  }

  try {
    const available = await Pedometer.isAvailableAsync();
    if (!available) return { steps: 0, source: 'unavailable' };

    const result = await Pedometer.getStepCountAsync(start, end);
    return { steps: result?.steps ?? 0, source: 'pedometer' };
  } catch {
    return { steps: 0, source: 'unavailable' };
  }
}

// Read today's steps from health platform — useful on app cold start
export async function readTodayStepsFromHealth(): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const result = await readStepsFromHealth(startOfDay, new Date());
  return result.steps;
}
