import { act } from 'react';
import { useSettingsStore } from '../src/stores/settingsStore';

// Mock the database module — settingsStore calls getSetting/setSetting
jest.mock('../src/db/database', () => ({
  getSetting: jest.fn(async (key: string) => {
    const defaults: Record<string, string> = {
      daily_goal: '10000',
      unit: 'metric',
      streak_count: '0',
    };
    return defaults[key] ?? '';
  }),
  setSetting: jest.fn(async () => {}),
}));

beforeEach(() => {
  // Reset store to initial state
  act(() => {
    useSettingsStore.setState({
      dailyGoal: 10000,
      unit: 'metric',
      streakCount: 0,
      loaded: false,
    });
  });
});

describe('settingsStore — initial state', () => {
  it('has correct defaults', () => {
    const s = useSettingsStore.getState();
    expect(s.dailyGoal).toBe(10000);
    expect(s.unit).toBe('metric');
    expect(s.streakCount).toBe(0);
    expect(s.loaded).toBe(false);
  });
});

describe('settingsStore — setDailyGoal', () => {
  it('updates dailyGoal', async () => {
    await act(async () => {
      await useSettingsStore.getState().setDailyGoal(8000);
    });
    expect(useSettingsStore.getState().dailyGoal).toBe(8000);
  });

  it('persists to setSetting', async () => {
    const { setSetting } = require('../src/db/database');
    await act(async () => {
      await useSettingsStore.getState().setDailyGoal(5000);
    });
    expect(setSetting).toHaveBeenCalledWith('daily_goal', '5000');
  });
});

describe('settingsStore — setUnit', () => {
  it('switches to imperial', async () => {
    await act(async () => {
      await useSettingsStore.getState().setUnit('imperial');
    });
    expect(useSettingsStore.getState().unit).toBe('imperial');
  });

  it('switches back to metric', async () => {
    await act(async () => {
      await useSettingsStore.getState().setUnit('imperial');
      await useSettingsStore.getState().setUnit('metric');
    });
    expect(useSettingsStore.getState().unit).toBe('metric');
  });
});

describe('settingsStore — setStreakCount', () => {
  it('updates streakCount synchronously', () => {
    act(() => useSettingsStore.getState().setStreakCount(7));
    expect(useSettingsStore.getState().streakCount).toBe(7);
  });

  it('can be reset to zero', () => {
    act(() => {
      useSettingsStore.getState().setStreakCount(30);
      useSettingsStore.getState().setStreakCount(0);
    });
    expect(useSettingsStore.getState().streakCount).toBe(0);
  });
});
