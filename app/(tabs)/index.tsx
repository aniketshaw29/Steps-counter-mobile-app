import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTodayStore } from '../../src/stores/todayStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { ProgressRing } from '../../src/components/ProgressRing';
import { MetricCard } from '../../src/components/MetricCard';
import { StepBarChart } from '../../src/components/StepBarChart';
import { StreakBadge } from '../../src/components/StreakBadge';
import { GoalCelebration } from '../../src/components/GoalCelebration';
import { getLast7Days, DailyRecord } from '../../src/db/database';
import { sendGoalReachedNotification, sendStreakNotification } from '../../src/services/NotificationService';
import { useColors } from '../../src/theme/useColors';
import { Spacing, FontSize } from '../../src/theme';
import { metersToKm, metersToMiles } from '../../src/utils/calculations';

export default function TodayScreen() {
  const C = useColors();
  const steps = useTodayStore((s) => s.steps);
  const distanceM = useTodayStore((s) => s.distanceM);
  const calories = useTodayStore((s) => s.calories);
  const percent = useTodayStore((s) => s.percent);
  const goalMet = useTodayStore((s) => s.goalMet);
  const celebrationFired = useTodayStore((s) => s.celebrationFired);
  const markCelebrationFired = useTodayStore((s) => s.markCelebrationFired);

  const goal = useSettingsStore((s) => s.dailyGoal);
  const unit = useSettingsStore((s) => s.unit);
  const streak = useSettingsStore((s) => s.streakCount);

  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebScale = useRef(new Animated.Value(1)).current;

  useEffect(() => { getLast7Days().then(setHistory); }, [steps]);

  useEffect(() => {
    if (goalMet && !celebrationFired) {
      markCelebrationFired();
      setShowCelebration(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.sequence([
        Animated.timing(celebScale, { toValue: 1.12, duration: 180, useNativeDriver: true }),
        Animated.timing(celebScale, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
      sendGoalReachedNotification(steps);
      if ([3, 7, 14, 30, 60, 100].includes(streak)) sendStreakNotification(streak);
    }
  }, [goalMet]);

  const distanceLabel = unit === 'metric'
    ? `${metersToKm(distanceM)} km`
    : `${metersToMiles(distanceM)} mi`;

  return (
    <>
      <ScrollView
        style={[styles.scroll, { backgroundColor: C.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.streakRow}>
          <StreakBadge count={streak} />
        </View>

        <View style={styles.ringContainer}>
          <Animated.View style={{ transform: [{ scale: celebScale }] }}>
            <ProgressRing percent={percent} size={240} />
          </Animated.View>
          <View style={styles.ringCenter}>
            <Text style={[styles.stepCount, { color: C.onBackground }]}>{steps.toLocaleString()}</Text>
            <Text style={[styles.stepLabel, { color: C.onSurfaceVariant }]}>steps</Text>
            <Text style={[styles.goalLabel, { color: C.primary }]}>
              {goalMet ? '🎉 Goal reached!' : `Goal: ${goal.toLocaleString()}`}
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <MetricCard label="Distance" value={distanceLabel.split(' ')[0]} unit={distanceLabel.split(' ')[1]} />
          <MetricCard label="Calories" value={String(calories)} unit="kcal" />
          <MetricCard label="Progress" value={`${percent}%`} unit="of goal" />
        </View>

        <Text style={[styles.sectionTitle, { color: C.onBackground }]}>Last 7 Days</Text>
        <StepBarChart data={history} goal={goal} />
      </ScrollView>

      <GoalCelebration visible={showCelebration} steps={steps} onDone={() => setShowCelebration(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: Spacing.xxl },
  streakRow: { alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xs },
  ringContainer: { alignItems: 'center', marginTop: Spacing.md, marginBottom: Spacing.lg },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center', top: 0, bottom: 0, left: 0, right: 0 },
  stepCount: { fontSize: FontSize.hero, fontWeight: '800', lineHeight: FontSize.hero * 1.1 },
  stepLabel: { fontSize: FontSize.md, marginTop: -4 },
  goalLabel: { fontSize: FontSize.sm, marginTop: Spacing.xs, fontWeight: '600' },
  metricRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', paddingHorizontal: Spacing.lg, marginTop: Spacing.md, marginBottom: Spacing.xs },
});
