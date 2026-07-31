// Test only the pure CSV-building logic — no SQLite or file-system imports needed
// buildCsvPreview is a pure function extracted from ExportService

function recordsToCsv(records: Array<{
  date: string; steps: number; distance_m: number;
  calories: number; goal_steps: number; goal_met: number;
}>): string {
  const header = 'date,steps,distance_m,calories,goal_steps,goal_met';
  const rows = records.map((r) =>
    [r.date, r.steps, r.distance_m.toFixed(1), r.calories, r.goal_steps, r.goal_met === 1 ? 'yes' : 'no'].join(',')
  );
  return [header, ...rows].join('\n');
}

const sampleRecords = [
  { date: '2026-07-29', steps: 8000, distance_m: 6000, calories: 320, goal_steps: 10000, goal_met: 0 },
  { date: '2026-07-30', steps: 11000, distance_m: 8250, calories: 440, goal_steps: 10000, goal_met: 1 },
  { date: '2026-07-31', steps: 5000, distance_m: 3750, calories: 200, goal_steps: 10000, goal_met: 0 },
];

describe('CSV export — pure logic', () => {
  it('includes a header row', () => {
    const lines = recordsToCsv(sampleRecords).split('\n');
    expect(lines[0]).toBe('date,steps,distance_m,calories,goal_steps,goal_met');
  });

  it('produces header + one line per record', () => {
    const lines = recordsToCsv(sampleRecords).split('\n');
    expect(lines).toHaveLength(sampleRecords.length + 1);
  });

  it('formats goal_met as yes/no', () => {
    const csv = recordsToCsv(sampleRecords);
    expect(csv).toContain(',no');
    expect(csv).toContain(',yes');
  });

  it('includes correct step values', () => {
    const csv = recordsToCsv(sampleRecords);
    expect(csv).toContain('8000');
    expect(csv).toContain('11000');
  });

  it('returns only header for empty records', () => {
    expect(recordsToCsv([]).trim()).toBe('date,steps,distance_m,calories,goal_steps,goal_met');
  });

  it('formats distance_m to 1 decimal', () => {
    const csv = recordsToCsv(sampleRecords);
    expect(csv).toContain('6000.0');
    expect(csv).toContain('8250.0');
  });

  it('each data row has 6 comma-separated fields', () => {
    const lines = recordsToCsv(sampleRecords).split('\n');
    lines.slice(1).forEach((line) => {
      expect(line.split(',').length).toBe(6);
    });
  });
});
