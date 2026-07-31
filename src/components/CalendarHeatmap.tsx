import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Spacing, FontSize, Radius } from '../theme';
import { useColors } from '../theme/useColors';
import { DailyRecord } from '../db/database';
import { shortDayLabel } from '../utils/dateHelpers';

interface Props {
  records: DailyRecord[];   // up to 28–31 records for a month view
  goal: number;
}

const CELL = 36;
const GAP = 4;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarHeatmap({ records, goal }: Props) {
  const C = useColors();

  if (records.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: C.onSurfaceVariant }]}>
          No history yet — keep walking!
        </Text>
      </View>
    );
  }

  // Build a map of date → steps
  const stepMap: Record<string, number> = {};
  records.forEach((r) => { stepMap[r.date] = r.steps; });

  const maxSteps = Math.max(...records.map((r) => r.steps), 1);

  // Fill a 7-column grid from the first record's week
  const firstDate = new Date(records[0].date + 'T00:00:00');
  const startOffset = firstDate.getDay(); // 0 = Sun

  const cells: Array<{ date: string; steps: number } | null> = [
    ...Array(startOffset).fill(null),
    ...records.map((r) => ({ date: r.date, steps: r.steps })),
  ];

  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  function cellColor(steps: number): string {
    if (steps === 0) return C.surfaceVariant;
    const ratio = steps / maxSteps;
    if (steps >= goal) return C.primary;
    if (ratio > 0.6) return C.primaryContainer;
    if (ratio > 0.3) return C.surfaceVariant;
    return C.surfaceVariant;
  }

  function cellOpacity(steps: number): number {
    if (steps === 0) return 0.3;
    const ratio = steps / maxSteps;
    return 0.4 + ratio * 0.6;
  }

  return (
    <View style={styles.container}>
      {/* Day-of-week header */}
      <View style={styles.row}>
        {DAYS.map((d) => (
          <Text key={d} style={[styles.dayHeader, { color: C.onSurfaceVariant, width: CELL }]}>
            {d.slice(0, 1)}
          </Text>
        ))}
      </View>

      {/* Grid rows */}
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((cell, ci) => {
            if (!cell) return <View key={ci} style={[styles.cell, { backgroundColor: 'transparent' }]} />;
            const color = cellColor(cell.steps);
            const opacity = cellOpacity(cell.steps);
            return (
              <View
                key={ci}
                style={[styles.cell, { backgroundColor: color, opacity }]}
              >
                <Text style={[styles.cellDate, { color: C.onSurface }]}>
                  {new Date(cell.date + 'T00:00:00').getDate()}
                </Text>
              </View>
            );
          })}
        </View>
      ))}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={[styles.legendDot, { backgroundColor: C.surfaceVariant, opacity: 0.4 }]} />
        <Text style={[styles.legendText, { color: C.onSurfaceVariant }]}>Less</Text>
        <View style={[styles.legendDot, { backgroundColor: C.primaryContainer }]} />
        <View style={[styles.legendDot, { backgroundColor: C.primary }]} />
        <Text style={[styles.legendText, { color: C.onSurfaceVariant }]}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.lg },
  row: { flexDirection: 'row', gap: GAP, marginBottom: GAP },
  dayHeader: { fontSize: FontSize.xs, textAlign: 'center', marginBottom: 2, fontWeight: '600' },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellDate: { fontSize: 10, fontWeight: '600' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm },
  legendDot: { width: 14, height: 14, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs },
  empty: { alignItems: 'center', padding: Spacing.xl },
  emptyText: { fontSize: FontSize.sm },
});
