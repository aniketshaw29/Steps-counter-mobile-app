# Deployment Plan (100% Free)

## Overview

You never need to pay anything to build and distribute this app while it's a personal project.
If you decide to publish publicly on the Play Store, there's a one-time $25 fee — but that's optional.

---

## Free Services We'll Use

| Service | Cost | What it does |
|---|---|---|
| Expo Go | Free | Test on your phone daily, no build needed |
| EAS Build (Expo) | Free (30 builds/month) | Build APK/AAB in the cloud without Android Studio |
| EAS Update | Free (1 GB/month) | Push JS updates to the app after it's installed |
| GitHub | Free | Source control, backup your code |
| Google Play (Internal Testing) | Free | Share APK with up to 100 testers |
| Google Play Store | $25 one-time | Only if you want to publish publicly |

---

## Phase 1: Personal use on your phone (Free, no store needed)

This is the simplest path. You build an APK and install it directly on your phone.
No Play Store account needed.

### Step 1: Set up EAS (do this once)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login with your Expo account (create one free at expo.dev)
eas login

# Initialize EAS in your project
eas build:configure
```

### Step 2: Build an APK for direct install
```bash
# Build a preview APK (takes 5–10 min, runs in Expo's cloud)
eas build --platform android --profile preview
```

When done, EAS gives you a download link.

### Step 3: Install APK on your phone
1. Download the APK from the link to your Mac
2. Transfer to your phone (AirDrop / USB / Google Drive)
3. On your phone: Settings → **Install unknown apps** → allow your file manager
4. Tap the APK file → **Install**

Done! The app is on your phone, no Play Store needed.

---

## Phase 2: Share with friends / small group (Free)

### Option A: Direct APK sharing
- Build the APK as above
- Share the `.apk` file via WhatsApp, email, Google Drive
- Recipients install it the same way (allow unknown sources)
- **Limit:** You have to manually share each new version

### Option B: Google Play Internal Testing (Free, up to 100 testers)
1. Create a Google Play Developer account ($25 one-time)
2. Create the app listing (no review needed for internal testing)
3. Upload your AAB file (`eas build --platform android --profile production`)
4. Add testers by email
5. They get a Play Store link and can install / auto-update normally
- **Advantage:** Testers get automatic updates via Play Store

---

## Phase 3: Public release on Play Store (Optional, $25 one-time)

Only do this when the app is polished and you want strangers to find it.

### What you need
- Google Play Developer account ($25, one-time, never renewed)
- App icon (512×512 px PNG)
- Feature graphic (1024×500 px)
- Screenshots (at least 2 Android phone screenshots)
- Short description (80 chars)
- Full description (4000 chars max)
- Privacy policy URL (required if you request health/activity permissions)

### Privacy policy (required, free)
Since the app uses ACTIVITY_RECOGNITION (health data), Google requires a privacy policy.
Free option: Use [Privacy Policy Generator](https://www.privacypolicygenerator.info/) and host on:
- GitHub Pages (free) — create a `privacy-policy.html` in a GitHub repo
- Or any free static host (Netlify free tier)

### Build for production
```bash
eas build --platform android --profile production
# Generates a signed AAB (Android App Bundle)
# EAS handles the signing keys — no setup needed
```

### Submit to Play Store
```bash
eas submit --platform android
# Automatically uploads your AAB to Play Console
```

---

## EAS Build Profiles (configured in eas.json)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

| Profile | Output | Use for |
|---|---|---|
| development | Special Expo APK | Advanced debugging (not needed for now) |
| preview | .apk file | Installing directly on your phone |
| production | .aab file | Google Play Store submission |

---

## EAS Update — Push JS Changes Without Rebuilding

After users install your app, you can push JavaScript-only changes instantly without a new APK.

```bash
# After making code changes:
eas update --branch production --message "Fix step count bug"
```

Users with the app installed will get the update next time they open the app.
**Important:** This only works for JavaScript changes. If you change native modules or app.json,
you need a full rebuild.

**Free tier:** 1 GB bandwidth/month — plenty for a personal app.

---

## Keeping Costs at Zero

| Thing that costs money | Free alternative |
|---|---|
| Backend/server | No server needed — all data is local |
| Database hosting | SQLite on device |
| Push notifications | expo-notifications (device-to-device via Expo's free service) |
| Analytics | Skip it for v1 |
| Crash reporting | console.log + expo-updates error logs (free) |
| CI/CD | EAS Build free tier (30 builds/month) |

---

## Recommended Timeline

```
Today       → Install Expo, create project, see app on phone via Expo Go
Week 1–3    → Build features, test daily via Expo Go
Week 4      → Run eas build --profile preview → install APK on your phone
             → Use as your daily step counter
Month 2+    → Polish, decide if you want to share publicly
Optional    → $25 Play Store account → publish publicly
```

---

## GitHub Setup (Free, do this on Day 1)

Source control means your code is never lost — even if your Mac dies.

```bash
# In your project folder:
git init
git add .
git commit -m "Initial project setup"

# Create a repo on github.com (free), then:
git remote add origin https://github.com/YOURUSERNAME/steps-counter.git
git push -u origin main
```

Commit and push every time you finish a working feature.
