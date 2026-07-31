const STEP_LENGTH_M = 0.75; // average adult stride

export function stepsToDistanceM(steps: number): number {
  return steps * STEP_LENGTH_M;
}

export function metersToKm(m: number): string {
  return (m / 1000).toFixed(2);
}

export function metersToMiles(m: number): string {
  return (m / 1609.34).toFixed(2);
}

export function stepsToCalories(steps: number, weightKg = 70): number {
  // ~0.04 kcal per step for a 70 kg person
  return Math.round(steps * 0.04 * (weightKg / 70));
}

export function progressPercent(steps: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((steps / goal) * 100));
}
