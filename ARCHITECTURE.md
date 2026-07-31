# Architecture

## Overview

This is an **offline-first** React Native app built on Expo.
All data lives on the device — no server, no account, no cloud required.
The architecture has 4 layers: Sensor → Service → Store → UI.

```
┌────────────────────────────────────────────────────┐
│                     UI Layer                        │
│   app/(tabs)/index.tsx   history.tsx   settings.tsx │
│   components/ProgressRing  StepBarChart  MetricCard │
└─────────────────────┬──────────────────────────────┘
                       │ reads from
┌─────────────────────▼──────────────────────────────┐
│                   Store Layer (Zustand)              │
│   todayStore: { steps, distance, calories, goal }   │
│   settingsStore: { goal, unit, streak, lastGoal }   │
└─────────────────────┬──────────────────────────────┘
                       │ updates
┌─────────────────────▼──────────────────────────────┐
│                 Service Layer                        │
│   StepService       ← subscribes to pedometer       │
│   DatabaseService   ← reads/writes SQLite           │
│   NotificationService ← schedules reminders         │
└─────────────────────┬──────────────────────────────┘
                       │ wraps
┌─────────────────────▼──────────────────────────────┐
│              Native / Expo SDK Layer                 │
│   expo-sensors (Pedometer)                          │
│   expo-sqlite                                       │
│   expo-notifications                                │
│   react-native-reanimated                           │
└────────────────────────────────────────────────────┘
```

---

## Screen Navigation

We use **Expo Router** with a simple tab bar at the bottom.

```
App
└── (tabs)                  ← bottom tab navigator
    ├── index (Today)       ← default screen
    ├── history (History)
    └── settings (Settings)
```

No deep linking, no modals in v1. Keep it simple.

---

## Data Flow

### How a step gets counted and displayed

```
1. Phone's hardware step sensor detects a step
2. Android OS increments TYPE_STEP_COUNTER (a monotonic number since reboot)
3. expo-sensors Pedometer fires a callback with the delta (new steps since subscription)
4. StepService receives the delta, adds it to the current session total
5. StepService calls todayStore.addSteps(delta)
6. todayStore recalculates distance and calories
7. React components subscribed to todayStore re-render automatically
8. Every 30 seconds, StepService persists the current total to SQLite
9. At midnight, StepService closes the day's record and starts a new one
```

### How history is loaded

```
1. User taps "History" tab
2. history.tsx mounts, calls DatabaseService.getLast7Days()
3. SQLite returns 7 DailyRecord rows
4. StepBarChart renders bars proportional to step counts
5. StreakService calculates consecutive goal-met days
```

---

## Key Design Decisions

### Why offline-first?
- No server to maintain or pay for
- Works in airplane mode, subway, remote areas
- User data stays private on their device
- Simpler to build and test

### Why Zustand over Redux?
- 5x less boilerplate
- No Provider wrapping needed
- TypeScript support is excellent
- Fine for the scale of this app

### Why SQLite over AsyncStorage?
- AsyncStorage is a key-value store — can't query "steps for last 7 days" efficiently
- SQLite supports proper SQL queries like `SELECT * FROM daily_records WHERE date >= ?`
- expo-sqlite is built into Expo, no extra install needed

### Why managed Expo (not bare workflow)?
- You don't have Android Studio installed
- Managed Expo + EAS Build = build APKs in the cloud without local native tooling
- We can always eject to bare workflow later if we need advanced native features
- The step counting features we need (pedometer, notifications, SQLite) all work in managed workflow

### Cross-platform strategy
The codebase is 95% shared between Android and iOS. Platform differences are:
- Android: ACTIVITY_RECOGNITION runtime permission (Android 10+)
- iOS: NSMotionUsageDescription in app.json (static permission)
- Android: TYPE_STEP_COUNTER resets on reboot → must persist baseline
- iOS: CMPedometer provides historical data; Android does not

We handle these in `StepService.ts` using `Platform.OS` checks.

---

## State Management Details

### todayStore (Zustand)
```typescript
interface TodayState {
  steps: number            // steps today
  distance: number         // meters
  calories: number         // kcal
  goal: number             // daily step goal
  progressPercent: number  // 0–100
  goalMet: boolean
  lastUpdated: Date | null

  addSteps: (delta: number) => void
  setGoal: (goal: number) => void
  reset: () => void        // called at midnight
}
```

### settingsStore (Zustand + AsyncStorage persistence)
```typescript
interface SettingsState {
  dailyGoal: number          // default 10000
  unit: 'metric' | 'imperial'
  streakCount: number
  lastGoalMetDate: string | null  // 'YYYY-MM-DD'
  reminderEnabled: boolean
  reminderTime: string       // 'HH:MM'

  setGoal: (n: number) => void
  setUnit: (u: 'metric' | 'imperial') => void
  updateStreak: (date: string, goalMet: boolean) => void
}
```

---

## Component Architecture

### ProgressRing
- SVG circle with animated stroke-dashoffset
- Driven by `progressPercent` from todayStore
- Color shifts from grey → brand color → gold at 100%
- Celebrate animation (scale + glow) triggers once when goalMet flips true

### StepBarChart
- Pure SVG, no external chart library
- Renders 7 bars, each scaled to max steps in the period
- Today's bar highlighted in brand color
- Shows "0" days as a thin grey line so the bar grid doesn't look broken

### MetricCard
- Small tile showing one metric (distance, calories, active min)
- Reusable, takes `value`, `unit`, `icon` as props

---

## Permission Flow

```
App first launch
  └── Onboarding screen
        ├── Explain step tracking ("counts using your phone's motion sensor")
        ├── → request ACTIVITY_RECOGNITION (Android) / NSMotionUsage (iOS)
        │     ├── Granted → start StepService
        │     └── Denied → show "Manual entry" fallback or explain how to enable
        ├── Explain notifications ("daily reminders to stay active")
        ├── → request notification permission
        └── Set daily goal → navigate to Today screen
```

**Rule:** Never request a permission without explaining why first. iOS and Android both show system dialogs — if the user taps "Don't allow", they must go to Settings to re-enable.

---

## Error Handling Strategy

| Error | What happens |
|---|---|
| No step sensor hardware | Show message "Your device doesn't have a step sensor. Step tracking unavailable." |
| Permission denied | Show banner with link to Settings, app still opens |
| SQLite write fails | Log error silently; don't crash; retry on next tick |
| Pedometer subscription drops | Auto-resubscribe after 5s delay |
| Midnight rollover (app open) | StepService detects date change, closes yesterday's record, starts fresh |
