import * as SQLite from 'expo-sqlite';
import { MIGRATIONS } from './schema';
import { todayString } from '../utils/dateHelpers';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('steps.db');
  await runMigrations(db);
  return db;
}

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`CREATE TABLE IF NOT EXISTS _migrations (version INTEGER PRIMARY KEY)`);
  const rows = await database.getAllAsync<{ version: number }>(`SELECT version FROM _migrations`);
  const applied = new Set(rows.map((r) => r.version));

  for (const migration of MIGRATIONS) {
    if (!applied.has(migration.version)) {
      await database.execAsync(migration.sql);
      await database.runAsync(`INSERT INTO _migrations (version) VALUES (?)`, migration.version);
    }
  }
}

// ─── Daily Records ───────────────────────────────────────────────────────────

export interface DailyRecord {
  date: string;
  steps: number;
  distance_m: number;
  calories: number;
  goal_steps: number;
  goal_met: number;
}

export async function getTodayRecord(): Promise<DailyRecord> {
  const database = await getDb();
  const today = todayString();
  const existing = await database.getFirstAsync<DailyRecord>(
    `SELECT * FROM daily_records WHERE date = ?`,
    today
  );
  if (existing) return existing;

  const goal = await getSetting('daily_goal');
  const now = new Date().toISOString();
  await database.runAsync(
    `INSERT INTO daily_records (date, steps, distance_m, calories, goal_steps, goal_met, created_at, updated_at)
     VALUES (?, 0, 0, 0, ?, 0, ?, ?)`,
    today, Number(goal), now, now
  );
  return (await database.getFirstAsync<DailyRecord>(`SELECT * FROM daily_records WHERE date = ?`, today))!;
}

export async function updateTodayRecord(
  steps: number,
  distance_m: number,
  calories: number,
  goal_steps: number
): Promise<void> {
  const database = await getDb();
  const today = todayString();
  const goal_met = steps >= goal_steps ? 1 : 0;
  const now = new Date().toISOString();
  await database.runAsync(
    `INSERT INTO daily_records (date, steps, distance_m, calories, goal_steps, goal_met, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       steps = excluded.steps,
       distance_m = excluded.distance_m,
       calories = excluded.calories,
       goal_steps = excluded.goal_steps,
       goal_met = excluded.goal_met,
       updated_at = excluded.updated_at`,
    today, steps, distance_m, calories, goal_steps, goal_met, now, now
  );
}

export async function getLast7Days(): Promise<DailyRecord[]> {
  const database = await getDb();
  return database.getAllAsync<DailyRecord>(
    `SELECT * FROM daily_records
     WHERE date >= date('now', '-6 days')
     ORDER BY date ASC`
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSetting(key: string): Promise<string> {
  const database = await getDb();
  const row = await database.getFirstAsync<{ value: string }>(
    `SELECT value FROM settings WHERE key = ?`, key
  );
  return row?.value ?? '';
}

export async function setSetting(key: string, value: string): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key, value
  );
}

// ─── Streak ──────────────────────────────────────────────────────────────────

export async function recalculateStreak(): Promise<number> {
  const database = await getDb();
  const rows = await database.getAllAsync<{ date: string; goal_met: number }>(
    `SELECT date, goal_met FROM daily_records
     WHERE date <= date('now') ORDER BY date DESC LIMIT 90`
  );

  let streak = 0;
  const today = todayString();

  for (const row of rows) {
    if (row.date === today && row.goal_met === 0) continue; // today not yet done
    if (row.goal_met === 1) {
      streak++;
    } else {
      break;
    }
  }

  await setSetting('streak_count', String(streak));
  return streak;
}
