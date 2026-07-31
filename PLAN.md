# Steps Counter App — Project Plan

## What We're Building

A cross-platform mobile step counter app (Android-first, iOS-compatible) built with Expo + React Native.
It counts your daily steps, shows a progress ring toward your goal, tracks a 7-day bar chart, and maintains a streak.

---

## Tech Stack (final)

| Layer | Tool | Why |
|---|---|---|
| Framework | Expo SDK 52 (managed workflow) | No Android Studio needed, QR code testing via Expo Go |
| Language | TypeScript | Catches bugs early, great VS Code support |
| Navigation | Expo Router | File-based routing, feels like Next.js |
| Pedometer | expo-sensors | Built-in step counting for iOS + Android |
| Storage | expo-sqlite | Local database, no server needed |
| State | Zustand | Simplest state manager, minimal boilerplate |
| Charts | react-native-svg + custom | Lightweight, no heavy chart library |
| Animations | react-native-reanimated | Smooth progress ring animation |
| Notifications | expo-notifications | Goal reminders, streak alerts |
| Build | EAS Build (free tier) | Cloud builds — no Xcode/Android Studio needed |
| Updates | EAS Update (free tier) | Push JS changes without a new app store release |

**Why managed Expo (not bare workflow):**
You don't have Android Studio. Managed Expo lets you develop and test entirely via Expo Go + a QR code,
and build APKs in the cloud via EAS. For the features we need (pedometer, SQLite, notifications),
managed workflow is sufficient. Background counting on Android is handled by reading HealthKit
/ Health Connect rather than a raw Foreground Service.

---

## MVP Feature Set (v1.0)

### Must ship
- [ ] Live step count updating on screen
- [ ] Daily progress ring (fills as you walk toward goal)
- [ ] Distance and calories calculated from steps
- [ ] Set daily step goal (default 10,000)
- [ ] 7-day bar chart of step history
- [ ] Streak counter (consecutive days you hit your goal)
- [ ] Goal-reached celebration (animation + haptic)
- [ ] Daily reminder notification
- [ ] Works offline, no account required

### Phase 2 (after v1 ships)
- [ ] Monthly calendar heatmap
- [ ] Badges / achievements
- [ ] Inactivity nudge ("you've been sitting 2 hours")
- [ ] Home screen widget
- [ ] Dark mode

---

## Development Milestones

### Milestone 1 — Hello World on your phone (Day 1)
- Install Expo CLI
- Create project
- See "Hello World" on your Android phone via Expo Go (scan QR code)

### Milestone 2 — Step counting works (Days 2–3)
- Request ACTIVITY_RECOGNITION permission
- Subscribe to pedometer sensor
- Display live step count on screen
- Persist daily record to SQLite

### Milestone 3 — Core UI (Days 4–7)
- Today screen: progress ring, steps, distance, calories
- Goal configuration
- Goal-reached haptic + animation

### Milestone 4 — History (Week 2)
- History screen with 7-day bar chart
- Streak calculation

### Milestone 5 — Notifications + Polish (Week 2–3)
- Daily reminder notification
- Onboarding (permissions flow, goal setup)
- Settings screen
- Basic dark mode

### Milestone 6 — Release prep (Week 3–4)
- Test on physical Android phone (all features)
- EAS Build: generate APK/AAB
- Deploy to Google Play (free Internal Testing track)

---

## Free Resources We'll Use

| Service | Free Tier | What For |
|---|---|---|
| Expo Go | Free app | Test on device instantly (no build needed) |
| EAS Build | 30 free builds/month | Build APK/AAB without Android Studio |
| EAS Update | 1 GB bandwidth free | Push JS-only updates to users |
| Google Play | $25 one-time | Publish to Play Store (only if you want public) |
| GitHub | Free | Source control |
| Expo Snack | Free | Share code snippets for debugging |

---

## How Testing Works

### During development (daily)
1. Run `npx expo start` in your project folder
2. Scan the QR code with **Expo Go** on your Android phone
3. See live changes as you save files (hot reload)

### USB testing (for step sensor testing)
1. Enable Developer Mode on your Android phone (see TESTING.md)
2. Connect phone via USB
3. Run `npx expo start --tunnel` or use ADB
4. Expo Go opens automatically on device

### Before release
1. Run `eas build --platform android --profile preview`
2. EAS builds an APK in the cloud (takes ~5–10 min)
3. Download APK → install directly on your phone

---

## Repository Structure (what we'll build)

```
StepsCounter/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        ← Today screen (home)
│   │   ├── history.tsx      ← 7-day chart + streak
│   │   └── settings.tsx     ← Goal, units, notifications
│   └── _layout.tsx          ← Tab bar setup
├── src/
│   ├── services/
│   │   ├── StepService.ts        ← pedometer subscription
│   │   ├── DatabaseService.ts    ← SQLite read/write
│   │   └── NotificationService.ts
│   ├── stores/
│   │   ├── todayStore.ts    ← live steps state
│   │   └── settingsStore.ts ← goal, units
│   ├── components/
│   │   ├── ProgressRing.tsx ← animated SVG ring
│   │   ├── StepBarChart.tsx ← 7-day chart
│   │   └── MetricCard.tsx   ← distance/cal tiles
│   └── utils/
│       ├── calculations.ts  ← steps → distance/calories
│       └── dateHelpers.ts
├── assets/
│   └── animations/          ← Lottie celebration JSON
├── app.json                 ← Expo config
├── eas.json                 ← EAS Build config
└── tsconfig.json
```
