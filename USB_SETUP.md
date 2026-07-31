# Running the App on Your Android Phone via USB Cable

## What You Need

| Item | Status |
|---|---|
| Mac (your laptop) | ✅ |
| Android phone (spare) | ✅ |
| USB cable (phone to Mac) | ✅ |
| ADB (Android Debug Bridge) | ✅ Installed — see Step 1 |
| Expo Go app on phone | Install from Play Store |

---

## Step 1 — Install ADB on your Mac

> ✅ **Already done** — ADB v37.0.1 is installed at `~/platform-tools/adb`

**Do NOT use `brew install android-platform-tools`** — the Homebrew cask has a stale checksum as of July 2026 and will fail with a checksum mismatch error.

### Correct install method (what worked)

```bash
# 1. Download directly from Google
curl -L "https://dl.google.com/android/repository/platform-tools-latest-darwin.zip" -o /tmp/platform-tools.zip

# 2. Unzip (use -o flag to overwrite without prompting)
unzip -o /tmp/platform-tools.zip -d ~/

# 3. Add to PATH permanently
echo 'export PATH="$HOME/platform-tools:$PATH"' >> ~/.zshrc && source ~/.zshrc

# 4. Verify
adb version
```

Expected output:
```
Android Debug Bridge version 1.0.41
Version 37.0.1-15733141
Installed as /Users/I528803/platform-tools/adb
```

> **Note:** When running step 2, use `unzip -o` (overwrite flag) to avoid the interactive "replace file?" prompts.

---

## Step 2 — Enable Developer Mode on your Android Phone

1. Open **Settings** on your Android phone
2. Scroll to **"About phone"** (sometimes under "General management")
3. Find **"Build number"**
4. **Tap it 7 times rapidly** — you'll see "You are now a developer!"

---

## Step 3 — Enable USB Debugging

1. Go to **Settings → Developer options** (now visible after Step 2)
2. Toggle the switch **ON** at the top
3. Find **"USB debugging"** → toggle it **ON**
4. Confirm the warning → **OK**

---

## Step 4 — Connect Phone to Mac via USB

1. Plug your Android phone into your Mac using the USB cable
2. A dialog appears on the phone: **"Allow USB debugging?"**
3. Check **"Always allow from this computer"**
4. Tap **OK**

### Verify connection

```bash
adb devices
```

Expected output:
```
List of devices attached
KVFEBE5HHQIJCUMJ    device
```

> If it shows `unauthorized` instead of `device`: unlock your phone screen — the dialog re-appears. Tap "Always allow" → OK, then run `adb devices` again.

**Your device serial: `KVFEBE5HHQIJCUMJ`** (confirmed working ✅)

---

## Step 5 — Install Expo Go on your Phone

1. Open **Play Store** on your Android phone
2. Search **"Expo Go"**
3. Install it (free, by Expo)

---

## Step 6 — Run the App

```bash
cd "/Users/I528803/Documents/2-personal/coding-stuff/Steps-counter-mobile-app"
npx expo start
```

When the dev server is running, **press `a`** in the terminal.

Expo detects `KVFEBE5HHQIJCUMJ` via ADB, opens Expo Go on your phone, and loads the app.

```
› Opening on Android device KVFEBE5HHQIJCUMJ...
```

**Hot reload:** every time you save a file on your Mac, the app updates on your phone within 1–2 seconds — no need to restart.

---

## Troubleshooting

### `brew install android-platform-tools` fails with checksum error
Use the direct download method in Step 1 instead. This is a known Homebrew issue as of July 2026.

### `adb: command not found` after install
The PATH wasn't reloaded. Run:
```bash
source ~/.zshrc
```
Or open a new terminal window.

### `unauthorized` in `adb devices`
- Unlock your phone screen — the USB debugging dialog re-appears
- Tap **"Always allow from this computer"** → OK
- Run `adb devices` again

### `adb daemon` starts but no device listed
- Try a different USB cable (some cables are charge-only, not data)
- Try a different USB port on your Mac
- Restart ADB: `adb kill-server && adb start-server`

### App doesn't open after pressing `a`
- Make sure Expo Go is installed on the phone
- Try pressing `a` again
- Or scan the QR code manually in Expo Go

### Hot reload stopped working
Press `r` in the terminal to force a full reload.

---

## Quick Reference

```bash
# Check phone is connected
adb devices

# Start dev server and open on Android
npx expo start
# then press 'a'

# Restart ADB daemon
adb kill-server && adb start-server

# Take a screenshot from phone → Mac
adb exec-out screencap -p > screenshot.png

# Watch live app logs
adb logcat -s ReactNativeJS:V

# Clear Expo Go app data (reset to fresh)
adb shell pm clear host.exp.exponent
```

---

## USB vs WiFi vs Tunnel

| Mode | Command | Best for |
|---|---|---|
| **USB (ADB)** | `npx expo start` → press `a` | Fastest, most reliable, sensor testing |
| **WiFi (QR code)** | `npx expo start` → scan QR | Quick daily coding, no cable |
| **Tunnel** | `npx expo start --tunnel` | Different networks, hotspot |

For step sensor testing, **USB is recommended** — more reliable than WiFi.
