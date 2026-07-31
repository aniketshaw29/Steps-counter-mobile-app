import { create } from 'zustand';
import { stepsToDistanceM, stepsToCalories, progressPercent } from '../utils/calculations';

interface TodayState {
  steps: number;
  distanceM: number;
  calories: number;
  goal: number;
  percent: number;
  goalMet: boolean;
  celebrationFired: boolean;

  setGoal: (goal: number) => void;
  addSteps: (delta: number) => void;
  setSteps: (steps: number) => void;
  markCelebrationFired: () => void;
  reset: () => void;
}

export const useTodayStore = create<TodayState>((set, get) => ({
  steps: 0,
  distanceM: 0,
  calories: 0,
  goal: 10000,
  percent: 0,
  goalMet: false,
  celebrationFired: false,

  setGoal: (goal) => {
    const { steps } = get();
    set({
      goal,
      percent: progressPercent(steps, goal),
      goalMet: steps >= goal,
    });
  },

  addSteps: (delta) => {
    const { steps, goal, celebrationFired } = get();
    const newSteps = steps + delta;
    const newGoalMet = newSteps >= goal;
    set({
      steps: newSteps,
      distanceM: stepsToDistanceM(newSteps),
      calories: stepsToCalories(newSteps),
      percent: progressPercent(newSteps, goal),
      goalMet: newGoalMet,
      // trigger celebration only once per day
      celebrationFired: celebrationFired && !newGoalMet ? false : celebrationFired,
    });
  },

  setSteps: (steps) => {
    const { goal } = get();
    set({
      steps,
      distanceM: stepsToDistanceM(steps),
      calories: stepsToCalories(steps),
      percent: progressPercent(steps, goal),
      goalMet: steps >= goal,
    });
  },

  markCelebrationFired: () => set({ celebrationFired: true }),

  reset: () =>
    set({
      steps: 0,
      distanceM: 0,
      calories: 0,
      percent: 0,
      goalMet: false,
      celebrationFired: false,
    }),
}));
