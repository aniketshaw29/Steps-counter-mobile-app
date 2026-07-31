import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AchievementDef } from '../utils/achievements';
import { useColors } from '../theme/useColors';
import { Spacing, FontSize, Radius } from '../theme';

interface Props {
  achievement: AchievementDef;
  unlocked: boolean;
}

export function AchievementCard({ achievement, unlocked }: Props) {
  const C = useColors();

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: unlocked ? C.primaryContainer : C.surfaceVariant,
        opacity: unlocked ? 1 : 0.5,
      },
    ]}>
      <Text style={styles.emoji}>{unlocked ? achievement.emoji : '🔒'}</Text>
      <Text style={[styles.title, { color: unlocked ? C.onPrimaryContainer : C.onSurfaceVariant }]}>
        {achievement.title}
      </Text>
      <Text style={[styles.desc, { color: C.onSurfaceVariant }]}>
        {achievement.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  emoji: { fontSize: 32, marginBottom: Spacing.xs },
  title: { fontSize: FontSize.sm, fontWeight: '700', textAlign: 'center', marginBottom: 2 },
  desc: { fontSize: FontSize.xs, textAlign: 'center', lineHeight: 16 },
});
