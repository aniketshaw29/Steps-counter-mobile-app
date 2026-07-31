import { HealthSyncResult, HealthSyncStatus } from '../src/services/HealthConnectService';

// Pure logic tests — no native module calls
// HealthConnectService integration tests require a real device with Health Connect

function pickBestStepSource(dbSteps: number, healthSteps: number | undefined, status: HealthSyncStatus): number {
  if (status !== 'ready' || healthSteps === undefined) return dbSteps;
  return healthSteps > dbSteps ? healthSteps : dbSteps;
}

describe('Health Connect step reconciliation', () => {
  it('uses DB steps when health is unavailable', () => {
    expect(pickBestStepSource(5000, undefined, 'unavailable')).toBe(5000);
  });

  it('uses DB steps when health returns error', () => {
    expect(pickBestStepSource(5000, 3000, 'error')).toBe(5000);
  });

  it('uses health steps when health has more steps than DB', () => {
    expect(pickBestStepSource(3000, 7000, 'ready')).toBe(7000);
  });

  it('uses DB steps when DB has more steps than health', () => {
    expect(pickBestStepSource(8000, 5000, 'ready')).toBe(8000);
  });

  it('uses DB steps when health and DB are equal', () => {
    expect(pickBestStepSource(5000, 5000, 'ready')).toBe(5000);
  });

  it('uses health steps when DB is 0 (first cold start)', () => {
    expect(pickBestStepSource(0, 4500, 'ready')).toBe(4500);
  });

  it('falls back to DB if health returns 0', () => {
    expect(pickBestStepSource(3000, 0, 'ready')).toBe(3000);
  });
});

describe('HealthSyncStatus types', () => {
  const validStatuses: HealthSyncStatus[] = [
    'unavailable', 'not_installed', 'permission_denied', 'ready', 'error',
  ];

  it('covers all expected status values', () => {
    expect(validStatuses).toHaveLength(5);
    expect(validStatuses).toContain('ready');
    expect(validStatuses).toContain('unavailable');
  });
});
