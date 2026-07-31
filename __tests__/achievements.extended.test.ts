import { ACHIEVEMENT_DEFS, checkAchievements } from '../src/utils/achievements';

describe('ACHIEVEMENT_DEFS integrity', () => {
  it('has exactly 12 achievements', () => {
    expect(ACHIEVEMENT_DEFS).toHaveLength(12);
  });

  it('all achievements have required fields', () => {
    ACHIEVEMENT_DEFS.forEach((a) => {
      expect(a.id).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.description).toBeTruthy();
      expect(a.emoji).toBeTruthy();
    });
  });

  it('all IDs are unique', () => {
    const ids = ACHIEVEMENT_DEFS.map((a) => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe('checkAchievements — zero inputs', () => {
  it('returns no achievements for all-zero inputs', () => {
    const ids = checkAchievements({ stepsToday: 0, streak: 0, totalGoalDays: 0, totalDistanceM: 0 });
    expect(ids).toHaveLength(0);
  });
});

describe('checkAchievements — step boundary tests', () => {
  const base = { streak: 0, totalGoalDays: 0, totalDistanceM: 0 };

  it('does not unlock first_1k at 999 steps', () => {
    expect(checkAchievements({ ...base, stepsToday: 999 })).not.toContain('first_1k');
  });

  it('unlocks first_1k at exactly 1000 steps', () => {
    expect(checkAchievements({ ...base, stepsToday: 1000 })).toContain('first_1k');
  });

  it('does not unlock first_5k at 4999 steps', () => {
    expect(checkAchievements({ ...base, stepsToday: 4999 })).not.toContain('first_5k');
  });

  it('unlocks first_5k at exactly 5000 steps', () => {
    expect(checkAchievements({ ...base, stepsToday: 5000 })).toContain('first_5k');
  });

  it('unlocks lower milestones too when higher is reached', () => {
    const ids = checkAchievements({ ...base, stepsToday: 5000 });
    expect(ids).toContain('first_1k');
    expect(ids).toContain('first_5k');
    expect(ids).not.toContain('first_10k');
  });
});

describe('checkAchievements — distance boundary tests', () => {
  const base = { stepsToday: 0, streak: 0, totalGoalDays: 0 };

  it('does not unlock dist_10km at 9999m', () => {
    expect(checkAchievements({ ...base, totalDistanceM: 9999 })).not.toContain('dist_10km');
  });

  it('unlocks dist_10km at exactly 10000m', () => {
    expect(checkAchievements({ ...base, totalDistanceM: 10000 })).toContain('dist_10km');
  });

  it('unlocks dist_10km but not dist_100km below threshold', () => {
    const ids = checkAchievements({ ...base, totalDistanceM: 50000 });
    expect(ids).toContain('dist_10km');
    expect(ids).not.toContain('dist_100km');
  });
});

describe('checkAchievements — goal_x5 and goal_x30', () => {
  const base = { stepsToday: 0, streak: 0, totalDistanceM: 0 };

  it('unlocks goal_x5 at exactly 5 goal days', () => {
    expect(checkAchievements({ ...base, totalGoalDays: 5 })).toContain('goal_x5');
  });

  it('does not unlock goal_x30 at 29 goal days', () => {
    expect(checkAchievements({ ...base, totalGoalDays: 29 })).not.toContain('goal_x30');
  });

  it('unlocks both goal_x5 and goal_x30 at 30 days', () => {
    const ids = checkAchievements({ ...base, totalGoalDays: 30 });
    expect(ids).toContain('goal_x5');
    expect(ids).toContain('goal_x30');
  });
});

describe('checkAchievements — multiple achievements at once', () => {
  it('unlocks all relevant achievements when all thresholds exceeded', () => {
    const ids = checkAchievements({
      stepsToday: 20001,
      streak: 31,
      totalGoalDays: 31,
      totalDistanceM: 101000,
    });
    expect(ids).toContain('first_1k');
    expect(ids).toContain('first_5k');
    expect(ids).toContain('first_10k');
    expect(ids).toContain('first_20k');
    expect(ids).toContain('streak_3');
    expect(ids).toContain('streak_7');
    expect(ids).toContain('streak_14');
    expect(ids).toContain('streak_30');
    expect(ids).toContain('goal_x5');
    expect(ids).toContain('goal_x30');
    expect(ids).toContain('dist_10km');
    expect(ids).toContain('dist_100km');
    expect(ids).toHaveLength(12); // all 12 unlocked
  });
});
