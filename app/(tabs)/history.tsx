import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StepBarChart } from '../../src/components/StepBarChart';
import { getLast7Days, DailyRecord } from '../../src/db/database';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/theme';
import { shortDayLabel } from '../../src/utils/dateHelpers';
import { metersToKm, metersToMiles } from '../../src/utils/calculations';

export default function HistoryScreen() {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const goal = useSettingsStore((s) => s.dailyGoal);
  const unit = useSettingsStore((s) => s.unit);
  const streak = useSettingsStore((s) => s.streakCount);

  useEffect(() => {
    getLast7Days().then(setRecords);
  }, []);

  const totalSteps = records.reduce((sum, r) => sum + r.steps, 0);
  const avgSteps = records.length ? Math.round(totalSteps / records.length) : 0;
  const daysGoalMet = records.filter((r) => r.goal_met === 1).length;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Weekly summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{avgSteps.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Avg / day</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{daysGoalMet}/7</Text>
          <Text style={styles.summaryLabel}>Goals met</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{streak}</Text>
          <Text style={styles.summaryLabel}>Day streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Last 7 Days</Text>
      <StepBarChart data={records} goal={goal} />

      {/* Day list */}
      <View style={styles.list}>
        {[...records].reverse().map((record) => {
          const dist =
            unit === 'metric'
              ? `${metersToKm(record.distance_m)} km`
              : `${metersToMiles(record.distance_m)} mi`;
          return (
            <View key={record.date} style={styles.dayRow}>
              <View>
                <Text style={styles.dayDate}>{record.date}</Text>
                <Text style={styles.dayDay}>{shortDayLabel(record.date)}</Text>
              </View>
              <View style={styles.dayRight}>
                <Text style={styles.daySteps}>{record.steps.toLocaleString()}</Text>
                <Text style={styles.dayDist}>{dist}</Text>
              </View>
              {record.goal_met === 1 && (
                <View style={styles.goalBadge}>
                  <Text style={styles.goalBadgeText}>✓</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },

  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  summaryLabel: {
    fontSize: FontSize.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.onBackground,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },

  list: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  dayDate: { fontSize: FontSize.xs, color: Colors.onSurfaceVariant },
  dayDay: { fontSize: FontSize.md, fontWeight: '600', color: Colors.onSurface },
  dayRight: { marginLeft: 'auto', alignItems: 'flex-end' },
  daySteps: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  dayDist: { fontSize: FontSize.xs, color: Colors.onSurfaceVariant },
  goalBadge: {
    marginLeft: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalBadgeText: { color: Colors.onPrimary, fontSize: FontSize.xs, fontWeight: '700' },
});
