export const MIGRATIONS = [
  {
    version: 1,
    sql: `
      CREATE TABLE IF NOT EXISTS daily_records (
        date        TEXT PRIMARY KEY,
        steps       INTEGER NOT NULL DEFAULT 0,
        distance_m  REAL    NOT NULL DEFAULT 0,
        calories    INTEGER NOT NULL DEFAULT 0,
        goal_steps  INTEGER NOT NULL DEFAULT 10000,
        goal_met    INTEGER NOT NULL DEFAULT 0,
        created_at  TEXT    NOT NULL,
        updated_at  TEXT    NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      INSERT OR IGNORE INTO settings (key, value) VALUES
        ('daily_goal',          '10000'),
        ('unit',                'metric'),
        ('streak_count',        '0'),
        ('last_goal_met_date',  ''),
        ('android_step_baseline', '0'),
        ('onboarding_complete', 'false');
    `,
  },
];
