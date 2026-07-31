# Steps Counter App — Project Plan

## What We're Building

A cross-platform mobile step counter app (Android-first, iOS-compatible) built with Expo + React Native.
It counts your daily steps, shows a progress ring toward your goal, tracks a 7-day bar chart, and maintains a streak.

---

## Tech Stack (final)

| Layer | Tool | Why |
|---|---|---|
| Framework | Expo SDK 57 (managed workflow) | No Android Studio needed, QR code testing via Expo Go |
| Language | TypeScript | Catches bugs early, great VS Code support |
| Navigation | Expo Router | File-based routing, feels like Next.js |
| Pedometer | expo-sensors | Built-in step counting for iOS + Android |
| Background tasks | expo-task-manager + expo-background-fetch | Background step counting when app is closed |
| Storage | expo-sqlite | Local database, no server needed |
| State | Zustand | Simplest state manager, minimal boilerplate |
| Charts | react-native-svg + custom | Lightweight, no heavy chart library |
| Animations | react-native-reanimated | Smooth progress ring animation |
| Icons | @expo/vector-icons | Tab bar icons, UI icons (Ionicons set) |
| Notifications | expo-notifications | Goal reminders, streak alerts, inactivity nudge |
| Build | EAS Build (free tier) | Cloud builds — no Xcode/Android Studio needed |
| Updates | EAS Update (free tier) | Push JS changes without a new app store release |

---

## Feature Set — All Phases

### ✅ Phase 1 — Foundation (Done)
- Live step count updating on screen
- Daily progress ring (animated SVG)
- Distance and calories calculated from steps
- SQLite database layer (daily records, settings, migrations)
- Zustand stores (todayStore, settingsStore)
- 21 unit tests

### ✅ Phase 2 — Polish (Done)
- Goal-reached celebration (haptic + animated modal)
- Streak tracker with flame badge
- Daily reminder notification
- Goal-reached + streak milestone notifications
- Onboarding flow (permissions → goal setup)

### ✅ Phase 3 — Features (Done)
- Dark mode (system-following, Material You tokens)
- 12 achievement badges (step milestones, streaks, distance)
- Calendar heatmap (month view in History)
- Week/month toggle in History
- Notification time picker in Settings
- EAS Build config (preview APK + production AAB)
- 41 unit tests total

### ✅ Phase 4 — Build & Deploy (Done)
- EAS Build: APK generated and installed on device
- EAS Workflow: automated Android + iOS production builds
- app.json: production-ready package name, permissions, versioning

### 🔨 Phase 5 — Quality & Background (In Progress)
- [ ] Tab bar icons (Ionicons — Today, History, Badges, Settings)
- [ ] Background step counting (expo-task-manager — counts when app is closed)
- [ ] Inactivity nudge notification ("You've been sitting 2 hours")
- [ ] Fix Dependabot security vulnerability
- [ ] Personal best tracking (record + display all-time best day)

### 📋 Phase 6 — Advanced (Planned)
- [ ] Home screen widget (today's steps without opening app)
- [ ] Weekly summary notification (Sunday recap)
- [ ] Data export (CSV download of full history)
- [ ] Health Connect integration (Android — sync with Google Health)
- [ ] Adaptive goal suggestions ("Your 7-day avg is 7,200 — try 8,000?")
- [ ] Play Store listing (public release — $25 one-time Google fee)

---

## Development Milestones

### ✅ Milestone 1 — Hello World on your phone
- Expo project scaffolded, visible on Android via Expo Go

### ✅ Milestone 2 — Step counting works
- ACTIVITY_RECOGNITION permission, live pedometer subscription, SQLite persistence

### ✅ Milestone 3 — Core UI
- Today screen: progress ring, steps, distance, calories, streak badge

### ✅ Milestone 4 — History
- History screen: 7-day bar chart, streak calculation, day list

### ✅ Milestone 5 — Notifications + Onboarding
- Daily reminder, goal celebration, onboarding flow, settings screen

### ✅ Milestone 6 — Dark mode + Achievements
- System dark mode, 12 achievement badges, calendar heatmap

### ✅ Milestone 7 — Release prep + Build
- EAS Build APK, production config, EAS workflow

### 🔨 Milestone 8 — Background counting + Icons (Current)
- Tab bar icons, background step counting, inactivity nudge

### 📋 Milestone 9 — Widget + Export + Health Connect

### 📋 Milestone 10 — Play Store public release

---

## Free Resources We'll Use

| Service | Free Tier | What For |
|---|---|---|
| Expo Go | Free app | Test on device instantly (no build needed) |
| EAS Build | 30 free builds/month | Build APK/AAB without Android Studio |
| EAS Update | 1 GB bandwidth free | Push JS-only updates to users |
| EAS Workflows | Free | Automated build pipelines |
| Google Play | $25 one-time | Publish to Play Store (optional) |
| GitHub | Free | Source control + Dependabot security alerts |
| Expo Snack | Free | Share code snippets for debugging |

---

## How Testing Works

### During development (daily)
1. Run `npx expo start` in your project folder
2. Scan the QR code with **Expo Go** on your Android phone
3. See live changes as you save files (hot reload)

### USB testing (for sensor testing)
1. Enable Developer Mode on Android phone (tap Build Number 7x)
2. Enable USB Debugging
3. Connect via USB → `npx expo start`
4. Press `a` to open on device

### Before release
1. `eas build --platform android --profile preview` → download APK → install directly
2. Or trigger the EAS workflow from expo.dev dashboard

---

## Repository Structure

```
├── app/
│   ├── _layout.tsx              ← Root layout (init DB, start step counting, onboarding check)
│   ├── onboarding.tsx           ← First-launch permissions + goal setup
│   └── (tabs)/
│       ├── _layout.tsx          ← Tab bar with icons
│       ├── index.tsx            ← Today screen (ring, steps, metrics, chart)
│       ├── history.tsx          ← History (week/month toggle, heatmap)
│       ├── achievements.tsx     ← 12 achievement badges
│       └── settings.tsx         ← Goal, units, notifications
├── src/
│   ├── components/
│   │   ├── ProgressRing.tsx     ← Animated SVG ring
│   │   ├── StepBarChart.tsx     ← 7-day bar chart
│   │   ├── CalendarHeatmap.tsx  ← Month heatmap grid
│   │   ├── MetricCard.tsx       ← Distance / calories tiles
│   │   ├── StreakBadge.tsx      ← Flame streak badge
│   │   ├── GoalCelebration.tsx  ← Goal-reached modal
│   │   └── AchievementCard.tsx  ← Badge card (locked/unlocked)
│   ├── services/
│   │   ├── StepService.ts       ← Pedometer subscription + DB sync
│   │   ├── BackgroundStepService.ts ← Background step counting (NEW)
│   │   └── NotificationService.ts   ← Reminders + alerts
│   ├── stores/
│   │   ├── todayStore.ts        ← Live steps state (Zustand)
│   │   └── settingsStore.ts     ← Goal, unit, streak (Zustand)
│   ├── db/
│   │   ├── schema.ts            ← SQLite migrations
│   │   └── database.ts          ← All DB queries
│   ├── theme/
│   │   ├── index.ts             ← Material You light/dark colour tokens
│   │   └── useColors.ts         ← useColors() hook (system dark mode)
│   └── utils/
│       ├── calculations.ts      ← Steps → distance / calories
│       ├── dateHelpers.ts       ← Date formatting helpers
│       └── achievements.ts      ← Achievement definitions + check logic
├── __tests__/                   ← Unit tests (Jest) — 41 passing
├── postman/                     ← API collection (Phase 6 placeholder)
├── .eas/workflows/              ← EAS build automation
├── PLAN.md                      ← This file
├── ARCHITECTURE.md              ← Screen flow, data flow, component design
├── DATABASE.md                  ← SQLite schema, queries, calculations
├── TESTING.md                   ← Device testing guide (Expo Go + USB)
├── TESTING_STRATEGY.md          ← Unit test plan + Postman usage
└── DEPLOYMENT.md                ← Free build & deploy plan
```
