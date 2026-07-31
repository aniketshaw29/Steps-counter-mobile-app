import {
  initialize,
  requestPermission,
  readRecords,
  insertRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { todayString, dateString } from '../utils/dateHelpers';
import { stepsToDistanceM, stepsToCalories } from '../utils/calculations';

export type HealthSyncStatus =
  | 'unavailable'      // device has no Health Connect / not iOS
  | 'not_installed'    // Health Connect app not installed (Android < 14)
  | 'permission_denied'
  | 'ready'
  | 'error';

export interface HealthSyncResult {
  status: HealthSyncStatus;
  steps?: number;
  source?: string;
}

// ─── Android Health Connect ───────────────────────────────────────────────────

async function initHealthConnect(): Promise<HealthSyncStatus> {
  try {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) return 'unavailable';
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) return 'not_installed';
    await initialize();
    return 'ready';
  } catch {
    return 'error';
  }
}

async function requestHealthConnectPermissions(): Promise<boolean> {
  try {
    const granted = await requestPermission([
      { accessType: 'read',  recordType: 'Steps' },
      { accessType: 'write', recordType: 'Steps' },
    ]);
    return granted.length > 0;
  } catch {
    return false;
  }
}

async function readTodayStepsAndroid(): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { records } = await readRecords('Steps', {
    timeRangeFilter: {
      operator: 'between',
      startTime: startOfDay.toISOString(),
      endTime: new Date().toISOString(),
    },
  });

  return records.reduce((sum: number, r: any) => sum + (r.count ?? 0), 0);
}

async function writeTodayStepsAndroid(steps: number): Promise<void> {
  if (steps <= 0) return;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  await insertRecords([
    {
      recordType: 'Steps',
      count: steps,
      startTime: startOfDay.toISOString(),
      endTime: new Date().toISOString(),
    },
  ]);
}

// ─── iOS HealthKit (via expo-sensors CMPedometer) ────────────────────────────

async function readTodayStepsIOS(): Promise<number> {
  try {
    const { status } = await Pedometer.requestPermissionsAsync();
    if (status !== 'granted') return 0;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const result = await Pedometer.getStepCountAsync(startOfDay, new Date());
    return result?.steps ?? 0;
  } catch {
    return 0;
  }
}

// ─── Unified public API ───────────────────────────────────────────────────────

export async function checkHealthAvailability(): Promise<HealthSyncStatus> {
  if (Platform.OS === 'ios') {
    const available = await Pedometer.isAvailableAsync().catch(() => false);
    return available ? 'ready' : 'unavailable';
  }
  return initHealthConnect();
}

export async function requestHealthPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const { status } = await Pedometer.requestPermissionsAsync();
    return status === 'granted';
  }
  const sdkStatus = await initHealthConnect();
  if (sdkStatus !== 'ready') return false;
  return requestHealthConnectPermissions();
}

// Read today's steps from the health platform (used on cold start to reconcile)
export async function syncStepsFromHealth(): Promise<HealthSyncResult> {
  try {
    if (Platform.OS === 'ios') {
      const steps = await readTodayStepsIOS();
      return { status: 'ready', steps, source: 'HealthKit' };
    }

    const sdkStatus = await initHealthConnect();
    if (sdkStatus !== 'ready') return { status: sdkStatus };

    const granted = await requestHealthConnectPermissions();
    if (!granted) return { status: 'permission_denied' };

    const steps = await readTodayStepsAndroid();
    return { status: 'ready', steps, source: 'HealthConnect' };
  } catch {
    return { status: 'error' };
  }
}

// Write today's steps back to the health platform
export async function writeStepsToHealth(steps: number): Promise<void> {
  try {
    if (Platform.OS === 'ios') return; // CMPedometer is read-only — HealthKit writes need native module
    const sdkStatus = await initHealthConnect();
    if (sdkStatus !== 'ready') return;
    await writeTodayStepsAndroid(steps);
  } catch {
    // silently fail — writing to health is best-effort
  }
}
