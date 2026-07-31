import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { getLast7Days, DailyRecord } from '../../src/db/database';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTodayStore } from '../../src/stores/todayStore';
import { AchievementCard } from '../../src/components/AchievementCard';
import { ACHIEVEMENT_DEFS, checkAchievements } from '../../src/utils/achievements';
import { useColors } from '../../src/theme/useColors';
import { Spacing, FontSize, Radius } from '../../src/theme';

export default function AchievementsScreen() {
  const C = useColors();
  const streak = useSettingsStore((s) => s.streakCount);
  const steps = useTodayStore((s) => s.steps);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [records, setRecords] = useState<DailyRecord[]>([]);

  useEffect(() => {
    getLast7Days().then((recs) => {
      setRecords(recs);
      const totalGoalDays = recs.filter((r) => r.goal_met === 1).length;
      const totalDistanceM = recs.reduce((s, r) => s + r.distance_m, 0);
      const ids = checkAchievements({ stepsToday: steps, streak, totalGoalDays, totalDistanceM });
      setUnlockedIds(new Set(ids));
    });
  }, [steps, streak]);

  const unlocked = ACHIEVEMENT_DEFS.filter((a) => unlockedIds.has(a.id));
  const locked = ACHIEVEMENT_DEFS.filter((a) => !unlockedIds.has(a.id));

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: C.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.banner, { backgroundColor: C.primaryContainer }]}>
        <Text style={[styles.bannerNum, { color: C.primary }]}>{unlocked.length}</Text>
        <Text style={[styles.bannerLabel, { color: C.onPrimaryContainer }]}>
          / {ACHIEVEMENT_DEFS.length} badges earned
        </Text>
      </View>

      {unlocked.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: C.onBackground }]}>Earned</Text>
          <View style={styles.grid}>
            {unlocked.map((a) => (
              <AchievementCard key={a.id} achievement={a} unlocked />
            ))}
          </View>
        </>
      )}

      <Text style={[styles.sectionTitle, { color: C.onBackground }]}>Locked</Text>
      <View style={styles.grid}>
        {locked.map((a) => (
          <AchievementCard key={a.id} achievement={a} unlocked={false} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: Spacing.xxl },
  banner: { margin: Spacing.lg, borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', alignItems: 'baseline', gap: Spacing.xs },
  bannerNum: { fontSize: 48, fontWeight: '800' },
  bannerLabel: { fontSize: FontSize.md, fontWeight: '600' },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.lg, justifyContent: 'space-between' },
});
