# Steps Counter

A cross-platform step counter mobile app built with **Expo + React Native**.  
Android-first, Material You design, 100% offline — no account, no server, no cloud required.

---

## Screenshots

> Coming soon — run the app and take screenshots!

---

## Features (v1)

- 🚶 **Live step counting** — updates in real time using your phone's motion sensor
- 🎯 **Daily goal + progress ring** — animated SVG ring fills as you walk
- 📊 **7-day bar chart** — visual history of your steps
- 🔥 **Streak tracker** — consecutive days you hit your goal
- 🎉 **Goal celebration** — haptic + animated overlay when you reach your goal
- 🔔 **Daily reminders** — configurable notification time
- 📦 **Fully offline** — all data stays on your device in SQLite

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | [Expo SDK 57](https://expo.dev) + React Native |
| Language | TypeScript |
| Navigation | [Expo Router](https://expo.github.io/router) |
| Step counting | [expo-sensors](https://docs.expo.dev/versions/latest/sdk/pedometer/) |
| Storage | [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) |
| State | [Zustand](https://zustand-demo.pmnd.rs/) |
| Charts | [react-native-svg](https://github.com/software-mansion/react-native-svg) (custom) |
| Animations | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| Notifications | [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) |
| Tests | [Jest](https://jestjs.io/) + [jest-expo](https://github.com/expo/expo/tree/main/packages/jest-expo) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) installed on your Android phone

### Run locally

```bash
# Clone the repo
git clone https://github.com/aniketshaw29/Steps-counter-mobile-app.git
cd Steps-counter-mobile-app

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with **Expo Go** on your phone — the app loads instantly.

### Run tests

```bash
npm test
```

---

## Project Structure

```
├── app/
│   ├── _layout.tsx           ← Root layout (init DB, start step counting)
│   ├── onboarding.tsx        ← First-launch permissions + goal setup
│   └── (tabs)/
│       ├── _layout.tsx       ← Tab bar
│       ├── index.tsx         ← Today screen
│       ├── history.tsx       ← History + streak
│       └── settings.tsx      ← Goal, units, notifications
├── src/
│   ├── components/
│   │   ├── ProgressRing.tsx  ← Animated SVG ring
│   │   ├── StepBarChart.tsx  ← 7-day bar chart
│   │   ├── MetricCard.tsx    ← Distance / calories tiles
│   │   ├── StreakBadge.tsx   ← Flame streak badge
│   │   └── GoalCelebration.tsx ← Goal-reached modal
│   ├── services/
│   │   ├── StepService.ts    ← Pedometer subscription + DB sync
│   │   └── NotificationService.ts ← Reminders + alerts
│   ├── stores/
│   │   ├── todayStore.ts     ← Live steps state (Zustand)
│   │   └── settingsStore.ts  ← Goal, unit, streak (Zustand)
│   ├── db/
│   │   ├── schema.ts         ← SQLite migrations
│   │   └── database.ts       ← All DB queries
│   ├── theme/
│   │   └── index.ts          ← Material You colours + spacing
│   └── utils/
│       ├── calculations.ts   ← Steps → distance / calories
│       └── dateHelpers.ts    ← Date formatting helpers
├── __tests__/                ← Unit tests (Jest)
├── postman/                  ← API collection (Phase 3 placeholder)
└── docs/                     ← Project documentation (see below)
```

---

## Documentation

| Doc | What it covers |
|---|---|
| [PLAN.md](PLAN.md) | Full roadmap, milestones, free resources |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Screen flow, data flow, component design, key decisions |
| [DATABASE.md](DATABASE.md) | SQLite schema, all queries, step calculation formulas |
| [TESTING.md](TESTING.md) | How to test on USB + Expo Go, per-feature checklist |
| [TESTING_STRATEGY.md](TESTING_STRATEGY.md) | Unit tests plan + Postman collection usage |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 100% free build & deploy plan (EAS Build + Play Store) |

---

## Development Phases

| Phase | Status | What |
|---|---|---|
| Phase 1 | ✅ Done | Scaffold, live step counter, Today/History/Settings screens, 21 unit tests |
| Phase 2 | ✅ Done | Streak badge, goal celebration, notifications, onboarding |
| Phase 3 | ✅ Done | Dark mode, achievements (12 badges), calendar heatmap, notification time picker |
| Phase 4 | 🔨 In progress | EAS Build → APK install on device → Play Store |

---

## Build APK (install on your Android phone)

No Android Studio needed — EAS builds in the cloud for free.

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login with your free Expo account (create one at expo.dev)
eas login

# 3. Build a preview APK (~5–10 minutes in Expo's cloud)
eas build --platform android --profile preview

# 4. EAS prints a download link when done
#    Download the .apk → transfer to phone → install
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full free deployment plan.

---

## Testing

See [TESTING.md](TESTING.md) for device setup guide and [TESTING_STRATEGY.md](TESTING_STRATEGY.md) for the full test plan.

```bash
npm test              # run all unit tests
npm test -- --watch   # watch mode
```

**41 unit tests** — calculations, date helpers, Zustand store, and achievements logic.

---

## Deployment (Free)

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full plan. Summary:

| Stage | Tool | Cost |
|---|---|---|
| Daily development | Expo Go (scan QR) | Free |
| Build APK | EAS Build (30/month) | Free |
| Install on phone | Direct APK sideload | Free |
| Play Store (optional) | Google Play Developer | $25 one-time |

---

## API / Postman

> v1 is fully offline — no backend exists yet.

The `postman/` folder contains a stub collection for the **Phase 3 cloud sync API** (planned).  
Import `postman/steps-counter-api.postman_collection.json` into Postman to see the planned endpoints.

---

## License

[MIT](LICENSE) © [aniketshaw29](https://github.com/aniketshaw29)
