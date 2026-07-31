import {
  stepsToDistanceM,
  metersToKm,
  metersToMiles,
  stepsToCalories,
  progressPercent,
} from '../src/utils/calculations';

describe('stepsToDistanceM — edge cases', () => {
  it('handles negative input gracefully', () => {
    expect(stepsToDistanceM(-100)).toBe(-75); // passes through, caller guards
  });

  it('handles very large step counts', () => {
    expect(stepsToDistanceM(1_000_000)).toBe(750_000);
  });

  it('is linear — doubling steps doubles distance', () => {
    expect(stepsToDistanceM(2000)).toBe(stepsToDistanceM(1000) * 2);
  });
});

describe('metersToKm — formatting', () => {
  it('pads to 2 decimal places', () => {
    expect(metersToKm(1000)).toBe('1.00');
    expect(metersToKm(1500)).toBe('1.50');
  });

  it('rounds correctly at boundary', () => {
    // 1010m / 1000 = 1.01 km exactly
    expect(metersToKm(1010)).toBe('1.01');
  });

  it('handles zero', () => {
    expect(metersToKm(0)).toBe('0.00');
  });
});

describe('metersToMiles — formatting', () => {
  it('returns 2 decimal places', () => {
    const result = metersToMiles(1609.34);
    expect(result.split('.')[1]).toHaveLength(2);
  });

  it('handles zero', () => {
    expect(metersToMiles(0)).toBe('0.00');
  });

  it('one mile is approximately 1609.34 meters', () => {
    expect(parseFloat(metersToMiles(1609.34))).toBeCloseTo(1, 1);
  });
});

describe('stepsToCalories — weight scaling', () => {
  it('heavier person burns more calories for same steps', () => {
    const light = stepsToCalories(10000, 60);
    const heavy = stepsToCalories(10000, 90);
    expect(heavy).toBeGreaterThan(light);
  });

  it('zero steps = zero calories regardless of weight', () => {
    expect(stepsToCalories(0, 50)).toBe(0);
    expect(stepsToCalories(0, 100)).toBe(0);
  });

  it('default weight is 70kg', () => {
    expect(stepsToCalories(10000)).toBe(stepsToCalories(10000, 70));
  });

  it('scales proportionally with step count', () => {
    expect(stepsToCalories(20000, 70)).toBe(stepsToCalories(10000, 70) * 2);
  });
});

describe('progressPercent — boundary conditions', () => {
  it('returns 0 at 0 steps', () => {
    expect(progressPercent(0, 10000)).toBe(0);
  });

  it('returns exactly 50 at half goal', () => {
    expect(progressPercent(5000, 10000)).toBe(50);
  });

  it('returns 100 at exact goal', () => {
    expect(progressPercent(10000, 10000)).toBe(100);
  });

  it('caps at 100 — never exceeds', () => {
    expect(progressPercent(99999, 10000)).toBe(100);
  });

  it('handles goal=1 (minimum valid goal)', () => {
    expect(progressPercent(1, 1)).toBe(100);
  });

  it('returns 0 for zero goal (no divide by zero)', () => {
    expect(progressPercent(5000, 0)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    // 3333 / 10000 = 33.33% → rounds to 33
    expect(progressPercent(3333, 10000)).toBe(33);
  });
});
