# Testing Guide

## Your Setup

- Mac (your development machine, where you write code)
- Spare Android phone (your test device, connected via USB cable)
- Expo Go app (install this on your Android phone — free on Play Store)

---

## Method 1: Expo Go via QR Code (easiest, use this daily)

No USB cable needed. Changes appear on your phone in seconds.

### One-time setup
1. Install **Expo Go** on your Android phone from the Play Store
2. Make sure your Mac and Android phone are on the **same WiFi network**

### Every development session
```bash
# 1. In your project folder on your Mac:
npx expo start

# 2. A QR code appears in your terminal
# 3. Open Expo Go on your phone
# 4. Tap "Scan QR Code" and scan it
# 5. The app loads on your phone!
```

**Hot reload:** Every time you save a file on your Mac, the app updates on your phone automatically within 1–2 seconds. No need to re-scan the QR code.

### When to use this: everyday coding, UI changes, logic changes

---

## Method 2: USB Connection (better for sensor testing)

The step counter sensor requires a real physical device. USB is more reliable than WiFi for this.

### One-time setup on your Android phone

**Step 1: Enable Developer Mode**
1. Open **Settings** on your Android phone
2. Scroll down to **"About phone"**
3. Find **"Build number"** (may be under Software info)
4. Tap **"Build number" 7 times** rapidly
5. You'll see "You are now a developer!" — this unlocks Developer Mode

**Step 2: Enable USB Debugging**
1. Go back to Settings
2. You'll now see a new menu: **Developer options** (or it may be under System → Developer options)
3. Tap it and toggle it **ON**
4. Find **"USB debugging"** and toggle it **ON**

**Step 3: Connect the cable**
1. Plug your Android phone into your Mac via USB
2. A dialog appears on your phone: **"Allow USB debugging?"** → tap **OK / Always allow**
3. On your Mac, run:
   ```bash
   npx expo start
   ```
4. Press `a` in the terminal to open on your Android device

### When to use this: testing the step sensor, testing notifications, before a release build

---

## Method 3: Expo Go via Tunnel (if WiFi method fails)

If your Mac and phone are on different networks (e.g., Mac on ethernet, phone on WiFi):

```bash
npx expo start --tunnel
```

This routes traffic through Expo's servers. Slower but works anywhere.

---

## Testing the Step Counter Specifically

The step counter only works on a real physical device (not a simulator or emulator).
The phone's hardware sensor is what detects steps — it can't be faked.

**How to test:**
1. Open the app via Expo Go
2. Hold your phone and walk around your room / up a hallway
3. The step count should increment within a few seconds

**If steps aren't counting:**
- Check that you granted ACTIVITY_RECOGNITION permission
  - Go to phone Settings → Apps → StepsCounter → Permissions → Physical activity → Allow
- Check that your phone has a step sensor: most Android phones (2015+) do

---

## Testing Each Feature

### Live step counter
- Walk with the phone → steps should increment in real time
- Shake the phone gently → may register as steps (this is normal — sensors aren't perfect)

### Progress ring
- Check that the ring fills proportionally (at 5000 steps with a 10000 goal → ring should be 50% full)
- Walk to goal (or temporarily set goal to 100 in Settings) → ring should fill and celebration should trigger

### 7-day chart
- Check app shows bars for days you've used it
- Empty days should show a thin grey bar (not crash)
- Bars should be proportional (a 10k-step day should look taller than a 2k-step day)

### Streak tracker
- Hit your goal today → streak should be 1 (or increment if already running)
- Miss a day → streak resets to 0

### Notifications
- Set a reminder in Settings for 2 minutes from now → notification should arrive
- Test that "Goal reached!" notification fires when you hit your goal

---

## What to Do When Things Break

### "Network response timed out" in Expo Go
Your phone and Mac might be on different network segments.
Fix: `npx expo start --tunnel`

### Steps not counting
1. Kill and reopen the app
2. Check permissions (Settings → Apps → your app → Permissions)
3. Make sure phone isn't in battery saver / low power mode (can throttle sensors)

### App crashes on open
Check the terminal on your Mac — the error will print there with a file and line number.

### "Something went wrong" screen in Expo Go
Shake your phone → tap "Open JS Debugger" or "Reload" to see the error.

### Hot reload stopped working
Press `r` in the terminal on your Mac to force a full reload.

---

## Before Every Build / Release

Run through this checklist on your physical Android phone:

```
[ ] Open app fresh (force-close first) → loads without crash
[ ] Permission prompt appears on first launch
[ ] Walking registers steps within 5 seconds
[ ] Progress ring updates as steps change
[ ] Tap Settings → change goal → return to Today → ring reflects new goal
[ ] History tab shows bars (not blank)
[ ] Streak number shows correctly
[ ] Notification: set reminder → wait → notification arrives
[ ] Put app in background, walk around, reopen → steps accumulated correctly
[ ] Reboot phone → open app → steps start fresh for the day (baseline reset)
```

---

## Debugging Tools

### See console logs from your app
In the terminal where you ran `npx expo start`, all `console.log()` output appears.

### React Native Debugger (optional, advanced)
Not needed at first. When you want deeper debugging, we'll set this up together.

### Expo Dev Tools
With the app open on your phone, shake it to open the Expo dev menu:
- **Reload** — full restart of the JS code
- **Toggle Element Inspector** — tap any UI element to see its styles
