# Play Store Listing Guide

## Overview

Publishing Steps Counter to the Google Play Store costs a **one-time $25 fee**.
Once your account is open, all future app updates are free.

This guide covers everything you need to submit.

---

## Step 1 — Create a Google Play Developer Account

1. Go to [play.google.com/console](https://play.google.com/console)
2. Sign in with your Google account
3. Pay the $25 one-time registration fee
4. Complete the account details form

---

## Step 2 — Build a Production AAB

```bash
cd "/Users/I528803/Documents/2-personal/coding-stuff/Steps-counter-mobile-app"
eas build --platform android --profile production
```

This generates a signed `.aab` (Android App Bundle) — the format Play Store requires.
EAS handles the signing key. Download the `.aab` when the build finishes.

---

## Step 3 — Create the App Listing

In Play Console → **Create app**

| Field | Value |
|---|---|
| App name | Steps Counter |
| Default language | English (US) |
| App or game | App |
| Free or paid | Free |

---

## Step 4 — Required Assets

### App Icon
- Size: **512 × 512 px** PNG
- No transparency, no rounded corners (Play adds them)
- Use the purple (#6750A4) brand colour as background

### Feature Graphic
- Size: **1024 × 500 px** PNG or JPG
- Shown at top of Play Store listing
- Simple design: app name + a step/shoe graphic on purple background

### Screenshots (minimum 2, recommend 4–5)
Take these on your Android phone with the app installed:

| Screen | What to show |
|---|---|
| Today screen | Progress ring at ~60%, streak badge visible |
| Today — goal reached | Ring filled gold, "Goal reached!" label |
| History | 7-day bar chart with some activity |
| Achievements | A few badges unlocked |
| Settings (optional) | Settings screen showing goal options |

**How to take screenshots:**
- On Android: Power + Volume Down simultaneously
- Or use `adb shell screencap` via USB

Screenshot dimensions: at least 320 × 480 px, max 3840 × 3840 px.
Phone screenshots should be portrait (9:16 ratio recommended).

---

## Step 5 — App Description

### Short description (max 80 chars)
```
Count your steps, hit your goal, build a daily streak. 100% offline.
```

### Full description (max 4000 chars)
```
Steps Counter is a simple, beautiful step tracking app that works completely offline — no account, no cloud, no data sharing.

🚶 LIVE STEP COUNTING
Your phone's built-in motion sensor counts steps automatically throughout the day. No GPS, no battery drain.

🎯 DAILY GOAL & PROGRESS RING
Set your personal step goal (default 10,000). Watch the animated ring fill as you walk. Celebrate when you hit it!

📊 7-DAY HISTORY
See your step activity over the past week with a clean bar chart. Track which days you hit your goal.

🔥 STREAK TRACKER
Build a daily streak — consecutive days you hit your goal. The streak badge keeps you motivated.

🏆 ACHIEVEMENTS
Earn 12 badges for step milestones, streaks, and distance goals. From "First Steps" to "30-day streak".

🗓️ CALENDAR HEATMAP
Switch to month view to see your activity pattern at a glance.

🌙 DARK MODE
Follows your system theme automatically. Looks great in both light and dark.

🔔 SMART NOTIFICATIONS
Optional daily reminder, goal celebration alert, and inactivity nudge ("you've been sitting 2 hours").

📦 YOUR DATA STAYS ON YOUR DEVICE
All step data is stored locally in SQLite. Nothing is uploaded anywhere. No account required. Export your data as CSV anytime.

Privacy-first. No ads. No tracking.
```

---

## Step 6 — Content Rating

In Play Console → Content rating → Start questionnaire

- Category: **Health & Fitness**
- No violence, no user-generated content, no location tracking
- Rating: **Everyone (E)**

---

## Step 7 — Privacy Policy (Required)

Google requires a privacy policy URL because the app uses `ACTIVITY_RECOGNITION` (health data).

### Free option: GitHub Pages

1. Create a file `privacy-policy.md` in your repo
2. Enable GitHub Pages on the repo (Settings → Pages → main branch)
3. Your policy URL: `https://aniketshaw29.github.io/Steps-counter-mobile-app/privacy-policy`

### Privacy policy text template

```markdown
# Privacy Policy — Steps Counter

Last updated: 2026-07-31

## Data collection
Steps Counter does not collect, transmit, or store any personal data on external servers.

## On-device data
Step counts, goals, and history are stored locally on your device using SQLite.
This data never leaves your device unless you explicitly use the "Export CSV" feature.

## Permissions
- ACTIVITY_RECOGNITION: used to count steps via the device's motion sensor
- RECEIVE_BOOT_COMPLETED: used to restart background step counting after reboot
- VIBRATE: used for haptic feedback on goal completion

## Third-party services
- Expo (build infrastructure only — no analytics or data collection)

## Contact
github.com/aniketshaw29/Steps-counter-mobile-app/issues
```

---

## Step 8 — Submit for Review

1. Upload your `.aab` in Play Console → Production → Create new release
2. Write release notes: `"Initial release of Steps Counter — track your daily steps, set goals, build a streak."`
3. Review all sections (they must all show green checkmarks)
4. Submit → Google reviews in **2–7 days** for new accounts

---

## After Approval — Push Updates

After the first release is approved, future updates via EAS Update are instant (no review needed for JS-only changes):

```bash
eas update --branch production --message "Fix step count display bug"
```

For native changes (new permissions, new packages), build a new AAB and submit via Play Console.
