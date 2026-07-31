import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Pedometer } from 'expo-sensors';
import { requestNotificationPermission, scheduleGoalReminder } from '../src/services/NotificationService';
import { useSettingsStore } from '../src/stores/settingsStore';
import { useTodayStore } from '../src/stores/todayStore';
import { startStepCounting } from '../src/services/StepService';
import { Colors, Spacing, FontSize, Radius } from '../src/theme';

type Step = 'welcome' | 'permissions' | 'goal';

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('welcome');
  const [goalInput, setGoalInput] = useState('10000');
  const [stepPermission, setStepPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [notifPermission, setNotifPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  const setDailyGoal = useSettingsStore((s) => s.setDailyGoal);
  const setGoalInStore = useTodayStore((s) => s.setGoal);
  const setSetting = useSettingsStore((s) => s.setUnit); // reuse to mark onboarding done

  const handleRequestStep = async () => {
    const { status } = await Pedometer.requestPermissionsAsync();
    setStepPermission(status === 'granted' ? 'granted' : 'denied');
  };

  const handleRequestNotif = async () => {
    const granted = await requestNotificationPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
    if (granted) await scheduleGoalReminder(20, 0); // default 8pm reminder
  };

  const handleFinish = async () => {
    const n = parseInt(goalInput, 10);
    const goal = isNaN(n) || n < 100 ? 10000 : n;
    await setDailyGoal(goal);
    setGoalInStore(goal);
    await startStepCounting();
    router.replace('/(tabs)');
  };

  // ── Welcome ───────────────────────────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <View style={styles.page}>
        <Text style={styles.hero}>👟</Text>
        <Text style={styles.title}>Steps Counter</Text>
        <Text style={styles.body}>
          Count your steps every day, track progress toward your goal,
          and build a healthy streak — all without any account or cloud sync.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => setStep('permissions')}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Permissions ───────────────────────────────────────────────────────────
  if (step === 'permissions') {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.title}>Permissions</Text>
        <Text style={styles.body}>We need two permissions to work properly.</Text>

        <View style={styles.permCard}>
          <Text style={styles.permTitle}>🚶 Step Tracking</Text>
          <Text style={styles.permBody}>
            Uses your phone's motion sensor to count steps. Your data never leaves the device.
          </Text>
          {stepPermission === 'unknown' && (
            <TouchableOpacity style={styles.permBtn} onPress={handleRequestStep}>
              <Text style={styles.permBtnText}>Allow Step Tracking</Text>
            </TouchableOpacity>
          )}
          {stepPermission === 'granted' && <Text style={styles.granted}>✓ Granted</Text>}
          {stepPermission === 'denied' && (
            <Text style={styles.denied}>Denied — enable in Settings → Privacy → Motion</Text>
          )}
        </View>

        <View style={styles.permCard}>
          <Text style={styles.permTitle}>🔔 Notifications</Text>
          <Text style={styles.permBody}>
            Optional daily reminders and goal celebration alerts.
          </Text>
          {notifPermission === 'unknown' && (
            <TouchableOpacity style={[styles.permBtn, styles.permBtnSecondary]} onPress={handleRequestNotif}>
              <Text style={[styles.permBtnText, styles.permBtnTextSecondary]}>Allow Notifications</Text>
            </TouchableOpacity>
          )}
          {notifPermission === 'granted' && <Text style={styles.granted}>✓ Granted</Text>}
          {notifPermission === 'denied' && (
            <Text style={styles.denied}>Skipped — you can enable later in Settings</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.btn, stepPermission === 'unknown' && styles.btnDisabled]}
          onPress={() => setStep('goal')}
          disabled={stepPermission === 'unknown'}
        >
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStep('goal')} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Goal Setup ────────────────────────────────────────────────────────────
  const presets = [5000, 8000, 10000, 15000];
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Set Your Goal</Text>
      <Text style={styles.body}>How many steps do you want to walk each day?</Text>

      <TextInput
        style={styles.goalInput}
        value={goalInput}
        onChangeText={setGoalInput}
        keyboardType="number-pad"
        returnKeyType="done"
      />

      <View style={styles.presets}>
        {presets.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.preset, goalInput === String(p) && styles.presetActive]}
            onPress={() => setGoalInput(String(p))}
          >
            <Text style={[styles.presetText, goalInput === String(p) && styles.presetTextActive]}>
              {(p / 1000).toFixed(0)}k
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleFinish}>
        <Text style={styles.btnText}>Start Counting!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  hero: { fontSize: 80, marginBottom: Spacing.lg },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.onBackground,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  body: {
    fontSize: FontSize.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: Colors.onPrimary, fontSize: FontSize.md, fontWeight: '700' },
  skipBtn: { marginTop: Spacing.md },
  skipText: { color: Colors.onSurfaceVariant, fontSize: FontSize.sm },

  permCard: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    width: '100%',
  },
  permTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.onSurface, marginBottom: 4 },
  permBody: { fontSize: FontSize.sm, color: Colors.onSurfaceVariant, marginBottom: Spacing.sm },
  permBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  permBtnSecondary: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.primary },
  permBtnText: { color: Colors.onPrimary, fontWeight: '700' },
  permBtnTextSecondary: { color: Colors.primary },
  granted: { color: Colors.success, fontWeight: '700', fontSize: FontSize.sm },
  denied: { color: Colors.warning, fontSize: FontSize.xs, marginTop: 4 },

  goalInput: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
    textAlign: 'center',
    width: 200,
    marginBottom: Spacing.lg,
  },
  presets: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  preset: {
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.outline,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  presetActive: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primary },
  presetText: { color: Colors.onSurfaceVariant, fontWeight: '600' },
  presetTextActive: { color: Colors.primary },
});
