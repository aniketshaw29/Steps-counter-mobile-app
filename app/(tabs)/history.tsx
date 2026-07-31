import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StepBarChart } from '../../src/components/StepBarChart';
import { CalendarHeatmap } from '../../src/components/CalendarHeatmap';
import { getLast7Days, DailyRecord } from '../../src/db/database';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useColors } from '../../src/theme/useColors';
import { Spacing, FontSize, Radius } from '../../src/theme';
import { shortDayLabel } from '../../src/utils/dateHelpers';
import { metersToKm, metersToMiles } from '../../src/utils/calculations';

type View2 = 'week' | 'month';

export default function HistoryScreen() {
  const C = useColors();
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [view, setView] = useState<View2>('week');
  const goal = useSettingsStore((s) => s.dailyGoal);
  const unit = useSettingsStore((s) => s.unit);
  const streak = useSettingsStore((s) => s.streakCount);

  useEffect(() => { getLast7Days().then(setRecords); }, []);

  const totalSteps = records.reduce((s, r) => s + r.steps, 0);
  const avgSteps = records.length ? Math.round(totalSteps / records.length) : 0;
  const daysGoalMet = records.filter((r) => r.goal_met === 1).length;

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: C.background }]} contentContainerStyle={styles.content}>
      {/* Summary cards */}
      <View style={styles.summaryRow}>
        {[
          { value: avgSteps.toLocaleString(), label: 'Avg / day' },
          { value: `${daysGoalMet}/7`, label: 'Goals met' },
          { value: String(streak), label: 'Day streak' },
        ].map((item) => (
          <View key={item.label} style={[styles.summaryCard, { backgroundColor: C.surfaceVariant }]}>
            <Text style={[styles.summaryValue, { color: C.onSurface }]}>{item.value}</Text>
            <Text style={[styles.summaryLabel, { color: C.onSurfaceVariant }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* View toggle */}
      <View style={[styles.toggle, { backgroundColor: C.surfaceVariant }]}>
        {(['week', 'month'] as const).map((v) => (
          <TouchableOpacity
            key={v}
            style={[styles.toggleBtn, view === v && { backgroundColor: C.primary }]}
            onPress={() => setView(v)}
          >
            <Text style={[styles.toggleText, { color: view === v ? C.onPrimary : C.onSurfaceVariant }]}>
              {v === 'week' ? '7 Days' : 'Month'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {view === 'week' ? (
        <>
          <Text style={[styles.sectionTitle, { color: C.onBackground }]}>Last 7 Days</Text>
          <StepBarChart data={records} goal={goal} />
          <View style={[styles.list, { gap: Spacing.sm }]}>
            {[...records].reverse().map((r) => {
              const dist = unit === 'metric' ? `${metersToKm(r.distance_m)} km` : `${metersToMiles(r.distance_m)} mi`;
              return (
                <View key={r.date} style={[styles.dayRow, { backgroundColor: C.surfaceVariant }]}>
                  <View>
                    <Text style={[styles.dayDay, { color: C.onSurface }]}>{shortDayLabel(r.date)}</Text>
                    <Text style={[styles.dayDate, { color: C.onSurfaceVariant }]}>{r.date}</Text>
                  </View>
                  <View style={styles.dayRight}>
                    <Text style={[styles.daySteps, { color: C.primary }]}>{r.steps.toLocaleString()}</Text>
                    <Text style={[styles.dayDist, { color: C.onSurfaceVariant }]}>{dist}</Text>
                  </View>
                  {r.goal_met === 1 && (
                    <View style={[styles.goalBadge, { backgroundColor: C.primary }]}>
                      <Text style={[styles.goalBadgeText, { color: C.onPrimary }]}>✓</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: C.onBackground }]}>This Month</Text>
          <CalendarHeatmap records={records} goal={goal} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: Spacing.xxl },
  summaryRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.sm },
  summaryCard: { flex: 1, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center' },
  summaryValue: { fontSize: FontSize.lg, fontWeight: '700' },
  summaryLabel: { fontSize: FontSize.xs, marginTop: 4 },
  toggle: { flexDirection: 'row', marginHorizontal: Spacing.lg, borderRadius: Radius.full, padding: 4, marginBottom: Spacing.md },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm, borderRadius: Radius.full },
  toggleText: { fontWeight: '600', fontSize: FontSize.sm },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', paddingHorizontal: Spacing.lg, marginBottom: Spacing.xs },
  list: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  dayRow: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, padding: Spacing.md },
  dayDay: { fontSize: FontSize.md, fontWeight: '600' },
  dayDate: { fontSize: FontSize.xs },
  dayRight: { marginLeft: 'auto', alignItems: 'flex-end' },
  daySteps: { fontSize: FontSize.md, fontWeight: '700' },
  dayDist: { fontSize: FontSize.xs },
  goalBadge: { marginLeft: Spacing.sm, borderRadius: Radius.full, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  goalBadgeText: { fontSize: FontSize.xs, fontWeight: '700' },
});
