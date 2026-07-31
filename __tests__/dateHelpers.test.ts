import { todayString, dateString, last7Days, shortDayLabel, isToday } from '../src/utils/dateHelpers';

describe('todayString', () => {
  it('returns a YYYY-MM-DD string', () => {
    const result = todayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('matches today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(todayString()).toBe(today);
  });
});

describe('dateString', () => {
  it('formats a Date as YYYY-MM-DD', () => {
    const d = new Date('2026-07-31T12:00:00Z');
    expect(dateString(d)).toBe('2026-07-31');
  });
});

describe('last7Days', () => {
  it('returns 7 items', () => {
    expect(last7Days()).toHaveLength(7);
  });
  it('last item is today', () => {
    const days = last7Days();
    expect(days[days.length - 1]).toBe(todayString());
  });
  it('items are in ascending order', () => {
    const days = last7Days();
    for (let i = 1; i < days.length; i++) {
      expect(days[i] > days[i - 1]).toBe(true);
    }
  });
});

describe('shortDayLabel', () => {
  it('returns 3-character day label', () => {
    const label = shortDayLabel('2026-07-31');
    expect(label).toHaveLength(3);
  });
});

describe('isToday', () => {
  it('returns true for today', () => {
    expect(isToday(todayString())).toBe(true);
  });
  it('returns false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(dateString(yesterday))).toBe(false);
  });
});
