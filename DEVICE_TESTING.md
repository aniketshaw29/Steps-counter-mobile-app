# Running Tests with Android Phone Connected via USB

## Overview

This project has two types of tests:

| Type | Requires Phone? | Command |
|---|---|---|
| **Unit tests** (Jest) | No — runs on Mac | `npm test` |
| **On-device tests** (Expo) | Yes — USB phone | `npx expo start` → manual |

Unit tests run entirely on your Mac via Node.js — no phone needed.
On-device testing means running the app on your phone and manually testing features.

---

## Part 1 — Unit Tests (Mac only, no phone needed)

```bash
cd "/Users/I528803/Documents/2-personal/coding-stuff/Steps-counter-mobile-app"
npm test
```

### Run in watch mode (re-runs on file save)
```bash
npm test -- --watch
```

### Run a specific test file
```bash
npm test -- __tests__/calculations.test.ts
```

### Run with coverage report
```bash
npm test -- --coverage
```

### Current test suite
```
12 test suites | 126 tests | ~2s runtime
```

---

## Part 2 — On-Device Testing via USB

### Prerequisites
1. ADB installed on Mac (`brew install android-platform-tools`)
2. USB debugging enabled on phone (see [USB_SETUP.md](USB_SETUP.md))
3. Phone connected via USB cable
4. Expo Go installed on phone

### Start the app on your phone
```bash
# Terminal 1 — start Expo dev server
npx expo start

# Press 'a' to open on Android device
```

### Manual test checklist (run after any significant change)

```
[ ] App opens without crash
[ ] Onboarding appears on fresh install
[ ] Step permission prompt shows (first launch)
[ ] Walk around → steps increment within 5 seconds
[ ] Progress ring fills proportionally
[ ] Goal reached → celebration modal appears (set goal to 100 to test quickly)
[ ] Haptic feedback fires on goal reached
[ ] Streak badge shows correct count
[ ] History tab → 7-day bar chart renders
[ ] History tab → month view heatmap renders
[ ] Achievements tab → badges visible (locked/unlocked)
[ ] Settings → change goal → Today screen ring updates
[ ] Settings → change units → distance shows miles/km
[ ] Settings → export CSV → share sheet opens
[ ] Dark mode → switch phone to dark → app follows
[ ] Kill app → reopen → step count preserved
```

---

## Part 3 — Automated Device Testing with Claude + ADB

When your phone is connected via USB, Claude can run ADB commands to:
- Check device connection
- View real-time app logs
- Take screenshots
- Check if the app is installed

### Check phone is connected
```bash
adb devices
```
Expected:
```
List of devices attached
XXXXXXXXXXXXXXXX    device
```

### Watch live app logs
```bash
adb logcat | grep -E "expo|stepscounter|ReactNative"
```

### Take a screenshot and save to Mac
```bash
adb exec-out screencap -p > screenshot_$(date +%H%M%S).png
```

### Check if Expo Go is installed
```bash
adb shell pm list packages | grep expo
```

### Clear app data (reset to fresh install)
```bash
adb shell pm clear host.exp.exponent
```

### Install a local APK directly
```bash
# After building with: eas build --platform android --profile preview
# Download the APK, then:
adb install path/to/your-app.apk
```

---

## Part 4 — Claude Automation Hook

You can ask Claude to run tests automatically. Here's how it works:

### Ask Claude to run unit tests
Just say: **"run tests"** — Claude will execute:
```bash
npm test --no-coverage
```
And report which tests passed or failed.

### Ask Claude to check your phone connection
Just say: **"check my phone"** — Claude will run:
```bash
adb devices
```

### Ask Claude to take a screenshot
Just say: **"take a screenshot"** — Claude will run:
```bash
adb exec-out screencap -p > screenshot.png
```

### Ask Claude to watch logs while you test
Just say: **"show me app logs"** — Claude will run:
```bash
adb logcat -s ReactNativeJS:V
```

### Ask Claude to run the full pre-release checklist
Just say: **"run pre-release check"** — Claude will:
1. Run all unit tests
2. Check phone connection via ADB
3. Report results and any failures

---

## Part 5 — Setting Up ADB (First Time)

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install ADB
brew install android-platform-tools

# Verify
adb version

# Connect phone via USB, then:
adb devices
# Should show your device serial number with "device" status
```

See [USB_SETUP.md](USB_SETUP.md) for the full phone setup guide (Developer Mode, USB Debugging).

---

## Part 6 — CI/CD with EAS (Automated Cloud Builds)

EAS Build automatically runs on every push to `main` via the workflow in `.eas/workflows/create-production-builds.yml`.

You can also trigger manually:
```bash
# Preview APK (for direct install on phone)
eas build --platform android --profile preview

# Production AAB (for Play Store)
eas build --platform android --profile production

# Check build status
eas build:list
```

Monitor builds at: https://expo.dev/accounts/shaw-dev/projects/aniket-shaw
