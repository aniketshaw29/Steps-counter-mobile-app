// Home Screen Widget — Architecture & Roadmap
//
// A home screen widget that shows today's step count without opening the app.
//
// CURRENT STATUS: Stub / documentation only.
// Full implementation requires a native Expo Module (Kotlin for Android Glance API,
// Swift + WidgetKit for iOS). This is the most complex native feature in the app
// and requires ejecting to bare workflow or building a custom Expo dev client.
//
// ─── Android Widget (Glance API) ─────────────────────────────────────────────
//
// Approach: Custom Expo Module (Kotlin)
// 1. Create android/src/main/java/com/aniketshaw29/stepscounter/widget/
//    ├── StepWidget.kt        — AppWidgetProvider, reads SharedPreferences
//    └── StepWidgetReceiver.kt — BroadcastReceiver for updates
//
// 2. JavaScript bridge: write today's steps to SharedPreferences on every update
//    so the native widget can read it without waking JS runtime
//
// 3. AndroidManifest additions (handled by Expo config plugin):
//    <receiver android:name=".widget.StepWidgetReceiver"
//              android:exported="true">
//      <intent-filter>
//        <action android:name="android.appwidget.action.APPWIDGET_UPDATE"/>
//      </intent-filter>
//      <meta-data android:name="android.appwidget.provider"
//                 android:resource="@xml/step_widget_info"/>
//    </receiver>
//
// ─── iOS Widget (WidgetKit) ──────────────────────────────────────────────────
//
// Approach: Custom Expo Module (Swift) + App Group shared container
// 1. Create a Widget Extension target in Xcode
// 2. Share step data via App Groups UserDefaults
// 3. JS bridge writes to the shared container on every step update
// 4. Widget reads from the container — updates on system schedule (15–60 min)
//
// ─── Phase 7 implementation plan ────────────────────────────────────────────
//
// Step 1: Eject to bare workflow (npx expo prebuild)
// Step 2: Build Expo Module with Kotlin AppWidgetProvider
// Step 3: Write step data bridge (JS → SharedPreferences → Widget)
// Step 4: Test widget on physical Android device
// Step 5: iOS WidgetKit (requires Apple Developer account + Xcode)
//
// ─── Estimated effort ────────────────────────────────────────────────────────
//
// Android widget only: ~1–2 days (Kotlin, no Xcode needed)
// iOS widget: ~2–3 additional days (requires paid Apple Dev account)
//
// ─── Alternatives (no native code) ──────────────────────────────────────────
//
// • expo-widgets (community package) — simpler API but limited customization
// • react-native-widget-extension — iOS only, not actively maintained
// • Notification-based "live counter" — Android only, shows steps in status bar
//   notification without a full widget (achievable today with NotificationService)

// Bridge: write today's steps to SharedPreferences so the native widget can read it
// Called from StepService on every persist cycle
export async function updateWidgetData(steps: number, goal: number): Promise<void> {
  // No-op until native module is implemented
  // When the native module is built, this will call:
  //   NativeModules.StepWidget.update({ steps, goal, percent: Math.round(steps/goal*100) })
}

export const WIDGET_IMPLEMENTATION_STATUS = 'planned' as const;
