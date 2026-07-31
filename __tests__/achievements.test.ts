import { checkAchievements } from '../src/utils/achievements';

describe('checkAchievements — step milestones', () => {
  const base = { streak: 0, totalGoalDays: 0, totalDistanceM: 0 };

  it('unlocks first_1k at 1000 steps', () => {
    const ids = checkAchievements({ ...base, stepsToday: 1000 });
    expect(ids).toContain('first_1k');
  });

  it('does not unlock first_5k below 5000 steps', () => {
    const ids = checkAchievements({ ...base, stepsToday: 4999 });
    expect(ids).not.toContain('first_5k');
  });

  it('unlocks first_10k at exactly 10000 steps', () => {
    const ids = checkAchievements({ ...base, stepsToday: 10000 });
    expect(ids).toContain('first_10k');
  });

  it('unlocks all lower milestones when steps are high', () => {
    const ids = checkAchievements({ ...base, stepsToday: 20000 });
    expect(ids).toContain('first_1k');
    expect(ids).toContain('first_5k');
    expect(ids).toContain('first_10k');
    expect(ids).toContain('first_20k');
  });
});

describe('checkAchievements — streak milestones', () => {
  const base = { stepsToday: 0, totalGoalDays: 0, totalDistanceM: 0 };

  it('unlocks streak_3 at streak 3', () => {
    expect(checkAchievements({ ...base, streak: 3 })).toContain('streak_3');
  });

  it('unlocks streak_7 at streak 7', () => {
    const ids = checkAchievements({ ...base, streak: 7 });
    expect(ids).toContain('streak_3');
    expect(ids).toContain('streak_7');
  });

  it('does not unlock streak_7 at streak 6', () => {
    expect(checkAchievements({ ...base, streak: 6 })).not.toContain('streak_7');
  });
});

describe('checkAchievements — goal days', () => {
  const base = { stepsToday: 0, streak: 0, totalDistanceM: 0 };

  it('unlocks goal_x5 at 5 goal days', () => {
    expect(checkAchievements({ ...base, totalGoalDays: 5 })).toContain('goal_x5');
  });

  it('does not unlock goal_x30 at 29 days', () => {
    expect(checkAchievements({ ...base, totalGoalDays: 29 })).not.toContain('goal_x30');
  });
});

describe('checkAchievements — distance milestones', () => {
  const base = { stepsToday: 0, streak: 0, totalGoalDays: 0 };

  it('unlocks dist_10km at 10000m', () => {
    expect(checkAchievements({ ...base, totalDistanceM: 10000 })).toContain('dist_10km');
  });

  it('does not unlock dist_100km below 100km', () => {
    expect(checkAchievements({ ...base, totalDistanceM: 99999 })).not.toContain('dist_100km');
  });
});
