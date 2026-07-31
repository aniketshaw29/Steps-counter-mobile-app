import {
  todayString,
  dateString,
  last7Days,
  shortDayLabel,
  isToday,
} from '../src/utils/dateHelpers';

describe('dateString — specific dates', () => {
  it('formats correctly for start of year', () => {
    expect(dateString(new Date('2026-01-01T12:00:00Z'))).toBe('2026-01-01');
  });

  it('formats correctly for end of year', () => {
    expect(dateString(new Date('2026-12-31T23:59:00Z'))).toBe('2026-12-31');
  });

  it('zero-pads single-digit month and day', () => {
    const result = dateString(new Date('2026-03-05T00:00:00Z'));
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result).toBe('2026-03-05');
  });
});

describe('last7Days — structure', () => {
  it('has no duplicates', () => {
    const days = last7Days();
    const unique = new Set(days);
    expect(unique.size).toBe(7);
  });

  it('first item is 6 days ago', () => {
    const days = last7Days();
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    expect(days[0]).toBe(dateString(sixDaysAgo));
  });

  it('all items match YYYY-MM-DD format', () => {
    last7Days().forEach((d) => {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

describe('shortDayLabel — all 7 weekdays', () => {
  // 2026-07-27 is a Monday
  const weekDates = [
    { date: '2026-07-27', expected: 'Mon' },
    { date: '2026-07-28', expected: 'Tue' },
    { date: '2026-07-29', expected: 'Wed' },
    { date: '2026-07-30', expected: 'Thu' },
    { date: '2026-07-31', expected: 'Fri' },
    { date: '2026-08-01', expected: 'Sat' },
    { date: '2026-08-02', expected: 'Sun' },
  ];

  weekDates.forEach(({ date, expected }) => {
    it(`${date} → ${expected}`, () => {
      expect(shortDayLabel(date)).toBe(expected);
    });
  });
});

describe('isToday', () => {
  it('returns false for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isToday(dateString(tomorrow))).toBe(false);
  });

  it('returns false for last year', () => {
    expect(isToday('2025-01-01')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isToday('')).toBe(false);
  });
});
