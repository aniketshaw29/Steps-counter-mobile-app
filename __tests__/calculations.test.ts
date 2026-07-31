// Unit tests for calculations.ts
import {
  stepsToDistanceM,
  metersToKm,
  metersToMiles,
  stepsToCalories,
  progressPercent,
} from '../src/utils/calculations';

describe('stepsToDistanceM', () => {
  it('returns 0 for 0 steps', () => {
    expect(stepsToDistanceM(0)).toBe(0);
  });
  it('calculates distance using 0.75m stride', () => {
    expect(stepsToDistanceM(1000)).toBe(750);
    expect(stepsToDistanceM(10000)).toBe(7500);
  });
});

describe('metersToKm', () => {
  it('converts meters to km string with 2 decimal places', () => {
    expect(metersToKm(7500)).toBe('7.50');
    expect(metersToKm(1000)).toBe('1.00');
    expect(metersToKm(500)).toBe('0.50');
  });
});

describe('metersToMiles', () => {
  it('converts meters to miles string', () => {
    expect(parseFloat(metersToMiles(1609.34))).toBeCloseTo(1, 1);
    expect(parseFloat(metersToMiles(0))).toBe(0);
  });
});

describe('stepsToCalories', () => {
  it('returns 0 for 0 steps', () => {
    expect(stepsToCalories(0)).toBe(0);
  });
  it('calculates ~400 kcal for 10000 steps at 70kg', () => {
    expect(stepsToCalories(10000, 70)).toBe(400);
  });
  it('scales proportionally with weight', () => {
    const light = stepsToCalories(10000, 50);
    const heavy = stepsToCalories(10000, 100);
    expect(heavy).toBeGreaterThan(light);
  });
});

describe('progressPercent', () => {
  it('returns 0 for 0 steps', () => {
    expect(progressPercent(0, 10000)).toBe(0);
  });
  it('returns 50 at half goal', () => {
    expect(progressPercent(5000, 10000)).toBe(50);
  });
  it('returns 100 at goal', () => {
    expect(progressPercent(10000, 10000)).toBe(100);
  });
  it('caps at 100 when over goal', () => {
    expect(progressPercent(15000, 10000)).toBe(100);
  });
  it('returns 0 for 0 goal to avoid division by zero', () => {
    expect(progressPercent(5000, 0)).toBe(0);
  });
});
