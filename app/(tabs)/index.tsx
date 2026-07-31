import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
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
import { Colors, Spacing, FontSize } from '../../src/theme';
import { metersToKm, metersToMiles } from '../../src/utils/calculations';

export default function TodayScreen() {
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

  useEffect(() => {
    getLast7Days().then(setHistory);
  }, [steps]);

  // Goal celebration — fires once per day when goal is first reached
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
      // Fire streak notification on milestones
      if ([3, 7, 14, 30, 60, 100].includes(streak)) {
        sendStreakNotification(streak);
      }
    }
  }, [goalMet]);

  const distanceLabel =
    unit === 'metric'
      ? `${metersToKm(distanceM)} km`
      : `${metersToMiles(distanceM)} mi`;

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak badge */}
        <View style={styles.streakRow}>
          <StreakBadge count={streak} />
        </View>

        {/* Progress ring + step hero */}
        <View style={styles.ringContainer}>
          <Animated.View style={{ transform: [{ scale: celebScale }] }}>
            <ProgressRing percent={percent} size={240} />
          </Animated.View>
          <View style={styles.ringCenter}>
            <Text style={styles.stepCount}>{steps.toLocaleString()}</Text>
            <Text style={styles.stepLabel}>steps</Text>
            <Text style={styles.goalLabel}>
              {goalMet ? '🎉 Goal reached!' : `Goal: ${goal.toLocaleString()}`}
            </Text>
          </View>
        </View>

        {/* Metric row */}
        <View style={styles.metricRow}>
          <MetricCard label="Distance" value={distanceLabel.split(' ')[0]} unit={distanceLabel.split(' ')[1]} />
          <MetricCard label="Calories" value={String(calories)} unit="kcal" />
          <MetricCard label="Progress" value={`${percent}%`} unit="of goal" />
        </View>

        {/* 7-day chart */}
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        <StepBarChart data={history} goal={goal} />
      </ScrollView>

      <GoalCelebration
        visible={showCelebration}
        steps={steps}
        onDone={() => setShowCelebration(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },

  streakRow: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },

  ringContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  stepCount: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: Colors.onBackground,
    lineHeight: FontSize.hero * 1.1,
  },
  stepLabel: {
    fontSize: FontSize.md,
    color: Colors.onSurfaceVariant,
    marginTop: -4,
  },
  goalLabel: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },

  metricRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.onBackground,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
});
