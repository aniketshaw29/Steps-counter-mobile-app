import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getDb } from '../db/database';
import { DailyRecord } from '../db/database';

function recordsToCsv(records: DailyRecord[]): string {
  const header = 'date,steps,distance_m,calories,goal_steps,goal_met';
  const rows = records.map((r) =>
    [r.date, r.steps, r.distance_m.toFixed(1), r.calories, r.goal_steps, r.goal_met === 1 ? 'yes' : 'no'].join(',')
  );
  return [header, ...rows].join('\n');
}

export async function exportStepsCSV(): Promise<void> {
  const database = await getDb();
  const records = await database.getAllAsync<DailyRecord>(
    `SELECT * FROM daily_records ORDER BY date ASC`
  );

  const csv = recordsToCsv(records);
  const fileName = `steps_export_${new Date().toISOString().split('T')[0]}.csv`;
  const file = new File(Paths.document, fileName);
  file.write(csv);

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) throw new Error('Sharing is not available on this device');

  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv',
    dialogTitle: 'Export step data',
    UTI: 'public.comma-separated-values-text',
  });
}

export function buildCsvPreview(records: DailyRecord[]): string {
  return recordsToCsv(records);
}
