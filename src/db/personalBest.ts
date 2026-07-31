import { getDb, getSetting, setSetting } from './database';

export interface PersonalBest {
  steps: number;
  date: string;
}

export async function getPersonalBest(): Promise<PersonalBest> {
  const steps = Number(await getSetting('personal_best_steps')) || 0;
  const date = await getSetting('personal_best_date');
  return { steps, date };
}

// Call this after updating today's record — checks and saves new PB if beaten
export async function checkAndUpdatePersonalBest(todaySteps: number, todayDate: string): Promise<boolean> {
  const current = await getPersonalBest();
  if (todaySteps > current.steps) {
    await setSetting('personal_best_steps', String(todaySteps));
    await setSetting('personal_best_date', todayDate);
    return true;  // new personal best!
  }
  return false;
}

export async function getAllTimeStats(): Promise<{
  totalSteps: number;
  totalDistanceM: number;
  totalDays: number;
  totalGoalDays: number;
}> {
  const database = await getDb();
  const row = await database.getFirstAsync<{
    total_steps: number;
    total_distance: number;
    total_days: number;
    goal_days: number;
  }>(
    `SELECT
       SUM(steps)      AS total_steps,
       SUM(distance_m) AS total_distance,
       COUNT(*)        AS total_days,
       SUM(goal_met)   AS goal_days
     FROM daily_records`
  );
  return {
    totalSteps:    row?.total_steps    ?? 0,
    totalDistanceM: row?.total_distance ?? 0,
    totalDays:     row?.total_days     ?? 0,
    totalGoalDays: row?.goal_days      ?? 0,
  };
}
