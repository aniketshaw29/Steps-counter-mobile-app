# Database Design

## Overview

We use **SQLite via expo-sqlite** — a local database file stored on the device.
Think of it as a spreadsheet that lives inside your app.
No internet, no server, no account needed.

---

## Tables

### `daily_records` — one row per day

This is the main table. Every day you use the app, one row gets written.

```sql
CREATE TABLE daily_records (
  date          TEXT PRIMARY KEY,  -- 'YYYY-MM-DD', e.g. '2026-07-31'
  steps         INTEGER NOT NULL DEFAULT 0,
  distance_m    REAL    NOT NULL DEFAULT 0,  -- meters
  calories      REAL    NOT NULL DEFAULT 0,  -- kcal
  active_min    INTEGER NOT NULL DEFAULT 0,
  goal_steps    INTEGER NOT NULL DEFAULT 10000,  -- goal on THAT day (can change)
  goal_met      INTEGER NOT NULL DEFAULT 0,      -- 0 = no, 1 = yes (SQLite has no bool)
  created_at    TEXT    NOT NULL,
  updated_at    TEXT    NOT NULL
);
```

**Example row:**
```
date        steps   distance_m  calories  active_min  goal_steps  goal_met
2026-07-31  8432    6318.4      210.8     54          10000       0
2026-07-30  11045   8283.75     276.1     72          10000       1
2026-07-29  10001   7500.75     250.0     68          10000       1
```

---

### `step_sessions` — tracks raw sensor sessions

Android's Step Counter sensor resets to 0 on reboot. We track sessions to handle this.

```sql
CREATE TABLE step_sessions (
  id            TEXT PRIMARY KEY,  -- UUID
  date          TEXT NOT NULL,     -- 'YYYY-MM-DD'
  baseline      INTEGER NOT NULL,  -- sensor reading at session start
  last_reading  INTEGER NOT NULL,  -- most recent sensor reading
  started_at    TEXT NOT NULL,
  ended_at      TEXT              -- NULL if session is still active
);
```

**Why we need this:**
- On Android, the sensor gives you a total like `1,423,891 steps since last reboot`.
- You need to subtract your baseline to get today's steps.
- If the phone reboots, the sensor resets to 0 — your baseline must too.
- Each reboot = a new session row.

**Example:**
```
Phone boots at 7am → sensor = 0
User starts app → baseline = 0, session starts
User walks 3000 steps → sensor = 3000, last_reading = 3000
User reboots phone at noon
Phone boots → sensor = 0
App opens → detects sensor < last_reading → new session, baseline = 0
User walks 2000 more steps → sensor = 2000
Total for day = (session 1: 3000) + (session 2: 2000) = 5000
```

---

### `settings` — key-value store for user preferences

```sql
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

**Rows we'll store:**
```
key                   value
daily_goal            10000
unit                  metric
reminder_enabled      true
reminder_time         20:00
streak_count          5
last_goal_met_date    2026-07-30
onboarding_complete   true
```

**Why not AsyncStorage?**
AsyncStorage also works for simple key-value. We use SQLite for everything to keep one data layer.

---

### `achievements` — badges earned

```sql
CREATE TABLE achievements (
  id           TEXT PRIMARY KEY,   -- e.g. 'first_10k', 'streak_7'
  unlocked_at  TEXT               -- NULL = locked, date string = unlocked
);
```

**Predefined achievement IDs:**
```
first_1k        — First day with 1,000+ steps
first_5k        — First day with 5,000+ steps
first_10k       — First day with 10,000+ steps
streak_3        — 3-day streak
streak_7        — 7-day streak
streak_30       — 30-day streak
goal_x5         — Hit goal 5 times total
personal_best   — New personal best steps in a day
```

---

## Queries We'll Use

### Get today's record (or create it if missing)
```sql
SELECT * FROM daily_records WHERE date = '2026-07-31';
-- If no row → INSERT with 0 steps
```

### Get last 7 days for the chart
```sql
SELECT date, steps, goal_steps, goal_met
FROM daily_records
WHERE date >= date('now', '-6 days')
ORDER BY date ASC;
```

### Get streak count
```sql
-- We calculate this in TypeScript, not SQL
-- Fetch last 90 days ordered by date DESC
-- Walk backwards counting consecutive goal_met = 1 days
SELECT date, goal_met
FROM daily_records
WHERE date >= date('now', '-90 days')
ORDER BY date DESC;
```

### Update steps for today
```sql
UPDATE daily_records
SET steps = ?, distance_m = ?, calories = ?, active_min = ?,
    goal_met = ?, updated_at = ?
WHERE date = '2026-07-31';
```

---

## Database Initialization

When the app first launches, we run these migrations:

```typescript
// src/db/migrations.ts
export const migrations = [
  {
    version: 1,
    sql: `
      CREATE TABLE IF NOT EXISTS daily_records ( ... );
      CREATE TABLE IF NOT EXISTS step_sessions ( ... );
      CREATE TABLE IF NOT EXISTS settings ( ... );
      CREATE TABLE IF NOT EXISTS achievements ( ... );
      
      INSERT OR IGNORE INTO settings (key, value) VALUES
        ('daily_goal', '10000'),
        ('unit', 'metric'),
        ('reminder_enabled', 'false'),
        ('reminder_time', '20:00'),
        ('streak_count', '0'),
        ('onboarding_complete', 'false');
    `
  }
]
```

---

## Step → Distance → Calorie Calculations

These run in `src/utils/calculations.ts`, not stored in the DB.

```typescript
// Average adult step length ≈ 0.75m (adjustable by height)
const STEP_LENGTH_M = 0.75

export function stepsToDistance(steps: number): number {
  return steps * STEP_LENGTH_M  // meters
}

export function stepsToCalories(steps: number, weightKg = 70): number {
  // MET-based formula: ~0.04 kcal per step per 70kg
  return steps * 0.04 * (weightKg / 70)
}

export function metersToKm(m: number): string {
  return (m / 1000).toFixed(2)
}

export function metersToMiles(m: number): string {
  return (m / 1609.34).toFixed(2)
}
```

---

## Data Lifecycle

```
App opens
  └── DatabaseService.initialize()
        ├── Run pending migrations
        ├── Load today's record (or create empty row)
        └── Load settings into settingsStore

During the day
  └── StepService sends deltas to DatabaseService.updateToday() every 30s

At midnight (app detects date change)
  └── DatabaseService.closeDay(yesterday)
        ├── Mark goal_met if steps >= goal_steps
        └── StreakService.recalculate()

App uninstalled
  └── All data deleted (no backup in v1 — Phase 2: export CSV)
```

---

## File Location on Device

SQLite files are stored in the app's private storage — only your app can access them.
On Android: `/data/data/com.yourname.stepscounter/databases/steps.db`
Users can't browse to this with a file manager (it's protected).
In v2, we can add a "Export data" button that copies it to Downloads.
