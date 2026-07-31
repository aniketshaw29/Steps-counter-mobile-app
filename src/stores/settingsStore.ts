import { create } from 'zustand';
import { getSetting, setSetting } from '../db/database';

interface SettingsState {
  dailyGoal: number;
  unit: 'metric' | 'imperial';
  streakCount: number;
  loaded: boolean;

  load: () => Promise<void>;
  setDailyGoal: (goal: number) => Promise<void>;
  setUnit: (unit: 'metric' | 'imperial') => Promise<void>;
  setStreakCount: (n: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  dailyGoal: 10000,
  unit: 'metric',
  streakCount: 0,
  loaded: false,

  load: async () => {
    const [goal, unit, streak] = await Promise.all([
      getSetting('daily_goal'),
      getSetting('unit'),
      getSetting('streak_count'),
    ]);
    set({
      dailyGoal: Number(goal) || 10000,
      unit: (unit as 'metric' | 'imperial') || 'metric',
      streakCount: Number(streak) || 0,
      loaded: true,
    });
  },

  setDailyGoal: async (goal) => {
    await setSetting('daily_goal', String(goal));
    set({ dailyGoal: goal });
  },

  setUnit: async (unit) => {
    await setSetting('unit', unit);
    set({ unit });
  },

  setStreakCount: (n) => set({ streakCount: n }),
}));
