// Streak calculation logic — pure function extracted for testability
// Mirrors the logic in src/db/database.ts recalculateStreak()

interface StreakRecord {
  date: string;
  goal_met: number;
}

function calculateStreak(records: StreakRecord[], today: string): number {
  let streak = 0;
  for (const row of records) {
    if (row.date === today && row.goal_met === 0) continue; // today not done yet
    if (row.goal_met === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

describe('streak calculation', () => {
  it('returns 0 with no records', () => {
    expect(calculateStreak([], '2026-07-31')).toBe(0);
  });

  it('returns 0 when today goal not met and no history', () => {
    expect(calculateStreak([
      { date: '2026-07-31', goal_met: 0 },
    ], '2026-07-31')).toBe(0);
  });

  it('skips today if goal not yet met, counts yesterday', () => {
    const records = [
      { date: '2026-07-31', goal_met: 0 }, // today — skipped
      { date: '2026-07-30', goal_met: 1 }, // yesterday — counts
      { date: '2026-07-29', goal_met: 1 }, // day before — counts
    ];
    expect(calculateStreak(records, '2026-07-31')).toBe(2);
  });

  it('counts consecutive goal-met days', () => {
    const records = [
      { date: '2026-07-31', goal_met: 1 },
      { date: '2026-07-30', goal_met: 1 },
      { date: '2026-07-29', goal_met: 1 },
    ];
    expect(calculateStreak(records, '2026-07-31')).toBe(3);
  });

  it('stops at first missed day', () => {
    const records = [
      { date: '2026-07-31', goal_met: 1 },
      { date: '2026-07-30', goal_met: 1 },
      { date: '2026-07-29', goal_met: 0 }, // gap — streak stops here
      { date: '2026-07-28', goal_met: 1 },
    ];
    expect(calculateStreak(records, '2026-07-31')).toBe(2);
  });

  it('returns 1 for only today goal met', () => {
    expect(calculateStreak([
      { date: '2026-07-31', goal_met: 1 },
    ], '2026-07-31')).toBe(1);
  });

  it('handles a long streak correctly', () => {
    const records = Array.from({ length: 30 }, (_, i) => ({
      date: `2026-07-${String(31 - i).padStart(2, '0')}`,
      goal_met: 1,
    }));
    expect(calculateStreak(records, '2026-07-31')).toBe(30);
  });
});
