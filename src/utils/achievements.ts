// Achievement definitions — baked into the app, no server needed
export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'first_1k',     emoji: '👣', title: 'First Steps',     description: 'Walk 1,000 steps in a day' },
  { id: 'first_5k',     emoji: '🚶', title: 'Getting Moving',  description: 'Walk 5,000 steps in a day' },
  { id: 'first_10k',    emoji: '🏆', title: '10K Club',        description: 'Walk 10,000 steps in a day' },
  { id: 'first_20k',    emoji: '⚡', title: 'Powerwalker',     description: 'Walk 20,000 steps in a day' },
  { id: 'streak_3',     emoji: '🔥', title: 'On Fire',         description: '3-day streak' },
  { id: 'streak_7',     emoji: '🌟', title: 'Week Warrior',    description: '7-day streak' },
  { id: 'streak_14',    emoji: '💪', title: 'Two Weeks Strong', description: '14-day streak' },
  { id: 'streak_30',    emoji: '🦁', title: 'Unstoppable',     description: '30-day streak' },
  { id: 'goal_x5',      emoji: '🎯', title: 'Goal Getter',     description: 'Hit your goal 5 times' },
  { id: 'goal_x30',     emoji: '🏅', title: 'Consistent',      description: 'Hit your goal 30 times' },
  { id: 'dist_10km',    emoji: '🗺️',  title: 'Explorer',       description: 'Walk 10 km total' },
  { id: 'dist_100km',   emoji: '🌍', title: 'Globetrotter',    description: 'Walk 100 km total' },
];

// Check which achievements should be unlocked based on stats
export function checkAchievements(params: {
  stepsToday: number;
  streak: number;
  totalGoalDays: number;
  totalDistanceM: number;
}): string[] {
  const { stepsToday, streak, totalGoalDays, totalDistanceM } = params;
  const unlocked: string[] = [];

  if (stepsToday >= 1000)  unlocked.push('first_1k');
  if (stepsToday >= 5000)  unlocked.push('first_5k');
  if (stepsToday >= 10000) unlocked.push('first_10k');
  if (stepsToday >= 20000) unlocked.push('first_20k');
  if (streak >= 3)         unlocked.push('streak_3');
  if (streak >= 7)         unlocked.push('streak_7');
  if (streak >= 14)        unlocked.push('streak_14');
  if (streak >= 30)        unlocked.push('streak_30');
  if (totalGoalDays >= 5)  unlocked.push('goal_x5');
  if (totalGoalDays >= 30) unlocked.push('goal_x30');
  if (totalDistanceM >= 10000)  unlocked.push('dist_10km');
  if (totalDistanceM >= 100000) unlocked.push('dist_100km');

  return unlocked;
}
