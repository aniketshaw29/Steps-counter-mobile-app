# Running the App on Your Android Phone via USB Cable

## What You Need

| Item | Status |
|---|---|
| Mac (your laptop) | ✅ Already have |
| Android phone (spare) | ✅ Already have |
| USB cable (phone to Mac) | ✅ Already have |
| ADB (Android Debug Bridge) | ❌ Need to install — guide below |
| Expo Go app on phone | Install from Play Store |

---

## Step 1 — Install ADB on your Mac

ADB lets your Mac talk to your Android phone over USB. The easiest way is via Homebrew.

### Install Homebrew (if not already installed)
Open **Terminal** on your Mac and run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install ADB via Homebrew
```bash
brew install android-platform-tools
```

### Verify it worked
```bash
adb version
```
Expected output:
```
Android Debug Bridge version 1.0.41
```

---

## Step 2 — Enable Developer Mode on your Android Phone

This is a one-time setup on the phone.

1. Open **Settings** on your Android phone
2. Scroll to **"About phone"** (sometimes under "General management")
3. Find **"Build number"**
4. **Tap it 7 times rapidly** — you'll see a countdown: "You are 3 steps away from being a developer"
5. After the 7th tap: **"You are now a developer!"**

---

## Step 3 — Enable USB Debugging

1. Go back to **Settings**
2. You'll now see **"Developer options"** (may be under Settings → System → Developer options)
3. Tap it, toggle the switch **ON** at the top
4. Scroll down, find **"USB debugging"** → toggle it **ON**
5. Confirm the warning dialog → **OK**

---

## Step 4 — Connect the Phone to your Mac

1. Plug your Android phone into your Mac using the USB cable
2. On your Android phone, a dialog appears:
   **"Allow USB debugging?"**
3. Check **"Always allow from this computer"**
4. Tap **OK**

### Verify the connection
On your Mac terminal:
```bash
adb devices
```
Expected output:
```
List of devices attached
XXXXXXXXXXXXXXX    device
```
If it shows `unauthorized` instead of `device`, unlock your phone and re-accept the USB debugging dialog.

---

## Step 5 — Install Expo Go on your Phone

1. Open **Play Store** on your Android phone
2. Search **"Expo Go"**
3. Install it (free, by Expo)

---

## Step 6 — Run the App

On your Mac terminal:
```bash
cd "/Users/I528803/Documents/2-personal/coding-stuff/Steps-counter-mobile-app"
npx expo start
```

When the dev server starts, press **`a`** in the terminal.

Expo will automatically:
1. Detect your connected Android device via ADB
2. Open Expo Go on your phone
3. Load the app

**The app will now appear on your phone!**

Every time you save a file on your Mac → the app updates on your phone within 1–2 seconds (hot reload).

---

## Troubleshooting

### "No devices found" after `adb devices`
- Make sure USB debugging is enabled on the phone
- Try a different USB cable (some cables are charge-only, not data)
- Unlock your phone screen and re-accept the debugging dialog
- Try: `adb kill-server && adb start-server`

### "Unauthorized" in adb devices
- Unlock your phone
- A dialog should appear — tap "Always allow" then OK
- If no dialog appears: Settings → Developer options → Revoke USB debugging authorizations → reconnect

### App doesn't open automatically after pressing `a`
- Make sure Expo Go is installed on the phone
- Try pressing `a` again in the terminal
- Or scan the QR code manually with Expo Go

### Hot reload not working
- Press `r` in the terminal to force reload
- If still stuck, shake the phone → tap "Reload"

### "Connection refused" error in Expo Go
- Make sure your Mac and phone are on the same WiFi (or use USB mode)
- In Expo terminal, press `s` to switch to "Expo Go" connection type
- Or run: `npx expo start --localhost` (forces USB/local connection)

---

## USB vs WiFi — Which to Use When

| Mode | How to start | Best for |
|---|---|---|
| **USB (ADB)** | `npx expo start` then press `a` | Fastest, most reliable, step sensor testing |
| **WiFi (QR code)** | `npx expo start` then scan QR in Expo Go | Quick daily coding when phone is nearby |
| **Tunnel** | `npx expo start --tunnel` | Different networks, hotspot situations |

For testing the step counter sensor, **USB is recommended** — more reliable than WiFi for sensor-heavy testing.

---

## Quick Reference Commands

```bash
# Check phone is connected
adb devices

# Start Expo and open on Android (USB)
npx expo start
# then press 'a'

# Restart ADB if device not detected
adb kill-server && adb start-server

# See phone logs (useful for debugging)
adb logcat | grep -i "expo\|stepscounter"

# Check what's installed on the phone
adb shell pm list packages | grep expo

# Capture a screenshot from phone to Mac
adb exec-out screencap -p > screenshot.png
```
