import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Switch, Alert,
} from 'react-native';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTodayStore } from '../../src/stores/todayStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/theme';

export default function SettingsScreen() {
  const dailyGoal = useSettingsStore((s) => s.dailyGoal);
  const unit = useSettingsStore((s) => s.unit);
  const setDailyGoal = useSettingsStore((s) => s.setDailyGoal);
  const setUnit = useSettingsStore((s) => s.setUnit);
  const setGoalInStore = useTodayStore((s) => s.setGoal);

  const [goalInput, setGoalInput] = useState(String(dailyGoal));

  const presets = [5000, 8000, 10000, 15000];

  const handleGoalSave = async () => {
    const n = parseInt(goalInput, 10);
    if (isNaN(n) || n < 100) {
      Alert.alert('Invalid goal', 'Please enter a number of at least 100 steps.');
      return;
    }
    await setDailyGoal(n);
    setGoalInStore(n);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Daily goal */}
      <Text style={styles.sectionTitle}>Daily Step Goal</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={goalInput}
            onChangeText={setGoalInput}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={handleGoalSave}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleGoalSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.presets}>
          {presets.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.preset, dailyGoal === p && styles.presetActive]}
              onPress={async () => {
                setGoalInput(String(p));
                await setDailyGoal(p);
                setGoalInStore(p);
              }}
            >
              <Text style={[styles.presetText, dailyGoal === p && styles.presetTextActive]}>
                {(p / 1000).toFixed(0)}k
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Units */}
      <Text style={styles.sectionTitle}>Units</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Use miles instead of km</Text>
          <Switch
            value={unit === 'imperial'}
            onValueChange={(v) => setUnit(v ? 'imperial' : 'metric')}
            trackColor={{ true: Colors.primary, false: Colors.outline }}
            thumbColor={Colors.onPrimary}
          />
        </View>
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <Text style={styles.aboutText}>Steps Counter v1.0</Text>
        <Text style={styles.aboutSub}>
          Your data stays on your device. No account required.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl, paddingTop: Spacing.md },

  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
    marginTop: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: Colors.surfaceVariant,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: FontSize.md, color: Colors.onSurface, flex: 1 },
  input: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.onSurface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 4,
    marginRight: Spacing.md,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  saveBtnText: { color: Colors.onPrimary, fontWeight: '700' },
  presets: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  preset: {
    flex: 1,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.outline,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  presetActive: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primary },
  presetText: { fontSize: FontSize.sm, color: Colors.onSurfaceVariant },
  presetTextActive: { color: Colors.primary, fontWeight: '700' },
  aboutText: { fontSize: FontSize.md, color: Colors.onSurface, fontWeight: '600' },
  aboutSub: { fontSize: FontSize.sm, color: Colors.onSurfaceVariant, marginTop: 4 },
});
