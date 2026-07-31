import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTodayStore } from '../../src/stores/todayStore';
import { scheduleGoalReminder, cancelGoalReminder } from '../../src/services/NotificationService';
import { exportStepsCSV } from '../../src/services/ExportService';
import { useColors } from '../../src/theme/useColors';
import { Spacing, FontSize, Radius } from '../../src/theme';

export default function SettingsScreen() {
  const C = useColors();
  const dailyGoal = useSettingsStore((s) => s.dailyGoal);
  const unit = useSettingsStore((s) => s.unit);
  const setDailyGoal = useSettingsStore((s) => s.setDailyGoal);
  const setUnit = useSettingsStore((s) => s.setUnit);
  const setGoalInStore = useTodayStore((s) => s.setGoal);

  const [goalInput, setGoalInput] = useState(String(dailyGoal));
  const [reminderOn, setReminderOn] = useState(false);
  const [reminderHour, setReminderHour] = useState('20');
  const [reminderMin, setReminderMin] = useState('00');
  const [exporting, setExporting] = useState(false);

  const presets = [5000, 8000, 10000, 15000];

  const handleGoalSave = async () => {
    const n = parseInt(goalInput, 10);
    if (isNaN(n) || n < 100) {
      Alert.alert('Invalid goal', 'Please enter at least 100 steps.');
      return;
    }
    await setDailyGoal(n);
    setGoalInStore(n);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportStepsCSV();
    } catch (e: any) {
      Alert.alert('Export failed', e?.message ?? 'Could not export data.');
    } finally {
      setExporting(false);
    }
  };

  const handleReminderToggle = async (val: boolean) => {
    setReminderOn(val);
    if (val) {
      const h = parseInt(reminderHour, 10) || 20;
      const m = parseInt(reminderMin, 10) || 0;
      await scheduleGoalReminder(h, m);
    } else {
      await cancelGoalReminder();
    }
  };

  const handleReminderTimeChange = async () => {
    if (!reminderOn) return;
    const h = parseInt(reminderHour, 10);
    const m = parseInt(reminderMin, 10);
    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
      Alert.alert('Invalid time', 'Enter a valid hour (0–23) and minute (0–59).');
      return;
    }
    await scheduleGoalReminder(h, m);
  };

  const card: object[] = [styles.card, { backgroundColor: C.surfaceVariant }];
  const sectionTitle: object[] = [styles.sectionTitle, { color: C.onSurfaceVariant }];

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: C.background }]} contentContainerStyle={styles.content}>

      {/* Goal */}
      <Text style={sectionTitle}>Daily Step Goal</Text>
      <View style={card}>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { color: C.onSurface, borderBottomColor: C.primary }]}
            value={goalInput}
            onChangeText={setGoalInput}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={handleGoalSave}
          />
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: C.primary }]} onPress={handleGoalSave}>
            <Text style={[styles.saveBtnText, { color: C.onPrimary }]}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.presets}>
          {presets.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.preset, { borderColor: C.outline }, dailyGoal === p && { backgroundColor: C.primaryContainer, borderColor: C.primary }]}
              onPress={async () => { setGoalInput(String(p)); await setDailyGoal(p); setGoalInStore(p); }}
            >
              <Text style={[styles.presetText, { color: dailyGoal === p ? C.primary : C.onSurfaceVariant }, dailyGoal === p && { fontWeight: '700' }]}>
                {(p / 1000).toFixed(0)}k
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Units */}
      <Text style={sectionTitle}>Units</Text>
      <View style={card}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: C.onSurface }]}>Use miles instead of km</Text>
          <Switch
            value={unit === 'imperial'}
            onValueChange={(v) => setUnit(v ? 'imperial' : 'metric')}
            trackColor={{ true: C.primary, false: C.outline }}
            thumbColor={C.onPrimary}
          />
        </View>
      </View>

      {/* Notifications */}
      <Text style={sectionTitle}>Notifications</Text>
      <View style={card}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: C.onSurface }]}>Daily reminder</Text>
          <Switch
            value={reminderOn}
            onValueChange={handleReminderToggle}
            trackColor={{ true: C.primary, false: C.outline }}
            thumbColor={C.onPrimary}
          />
        </View>
        {reminderOn && (
          <View style={styles.timeRow}>
            <Text style={[styles.timeLabel, { color: C.onSurfaceVariant }]}>Remind me at</Text>
            <TextInput
              style={[styles.timeInput, { color: C.onSurface, borderBottomColor: C.primary }]}
              value={reminderHour}
              onChangeText={setReminderHour}
              keyboardType="number-pad"
              maxLength={2}
              onBlur={handleReminderTimeChange}
            />
            <Text style={[styles.timeSep, { color: C.onSurface }]}>:</Text>
            <TextInput
              style={[styles.timeInput, { color: C.onSurface, borderBottomColor: C.primary }]}
              value={reminderMin}
              onChangeText={setReminderMin}
              keyboardType="number-pad"
              maxLength={2}
              onBlur={handleReminderTimeChange}
            />
          </View>
        )}
      </View>

      {/* About */}
      <Text style={sectionTitle}>About</Text>
      <View style={card}>
        <Text style={[styles.aboutText, { color: C.onSurface }]}>Steps Counter v1.0</Text>
        <Text style={[styles.aboutSub, { color: C.onSurfaceVariant }]}>
          Your data stays on your device. No account required.
        </Text>
      </View>

      {/* Data */}
      <Text style={sectionTitle}>Data</Text>
      <View style={card}>
        <TouchableOpacity
          style={[styles.exportBtn, { backgroundColor: C.primaryContainer }]}
          onPress={handleExport}
          disabled={exporting}
        >
          {exporting
            ? <ActivityIndicator color={C.primary} />
            : <Text style={[styles.exportBtnText, { color: C.primary }]}>📤 Export steps as CSV</Text>
          }
        </TouchableOpacity>
        <Text style={[styles.aboutSub, { color: C.onSurfaceVariant, marginTop: Spacing.sm }]}>
          Saves all history to a CSV file you can open in Excel or Google Sheets.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: Spacing.xxl, paddingTop: Spacing.md },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: '700', paddingHorizontal: Spacing.lg, marginBottom: Spacing.xs, marginTop: Spacing.lg, textTransform: 'uppercase', letterSpacing: 0.8 },
  card: { marginHorizontal: Spacing.lg, borderRadius: Radius.md, padding: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: FontSize.md, flex: 1 },
  input: { flex: 1, fontSize: FontSize.lg, fontWeight: '700', borderBottomWidth: 2, paddingBottom: 4, marginRight: Spacing.md },
  saveBtn: { borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  saveBtnText: { fontWeight: '700' },
  presets: { flexDirection: 'row', marginTop: Spacing.md, gap: Spacing.sm },
  preset: { flex: 1, borderRadius: Radius.sm, borderWidth: 1.5, alignItems: 'center', paddingVertical: Spacing.sm },
  presetText: { fontSize: FontSize.sm },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: Spacing.sm },
  timeLabel: { fontSize: FontSize.sm, marginRight: Spacing.sm },
  timeInput: { width: 40, fontSize: FontSize.lg, fontWeight: '700', borderBottomWidth: 2, textAlign: 'center', paddingBottom: 2 },
  timeSep: { fontSize: FontSize.lg, fontWeight: '700' },
  aboutText: { fontSize: FontSize.md, fontWeight: '600' },
  aboutSub: { fontSize: FontSize.sm, marginTop: 4 },
  exportBtn: { borderRadius: Radius.sm, padding: Spacing.md, alignItems: 'center' },
  exportBtnText: { fontWeight: '700', fontSize: FontSize.md },
});
