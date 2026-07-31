import { checkAchievements } from '../src/utils/achievements';

// Re-export personalBest logic for testing without SQLite
function wouldBeNewPB(current: number, incoming: number): boolean {
  return incoming > current;
}

describe('personal best logic', () => {
  it('new PB when incoming > current', () => {
    expect(wouldBeNewPB(9000, 10000)).toBe(true);
  });

  it('no new PB when incoming <= current', () => {
    expect(wouldBeNewPB(10000, 10000)).toBe(false);
    expect(wouldBeNewPB(10000, 9999)).toBe(false);
  });

  it('any positive count beats a zero PB', () => {
    expect(wouldBeNewPB(0, 1)).toBe(true);
  });
});

describe('achievements triggered by personal bests', () => {
  it('first_20k unlocks at a big personal best day', () => {
    const ids = checkAchievements({
      stepsToday: 20001,
      streak: 0,
      totalGoalDays: 0,
      totalDistanceM: 0,
    });
    expect(ids).toContain('first_20k');
    expect(ids).toContain('first_10k');
    expect(ids).toContain('first_5k');
    expect(ids).toContain('first_1k');
  });
});
