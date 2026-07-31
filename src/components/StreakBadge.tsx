import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Colors, FontSize, Spacing, Radius } from '../theme';

interface Props {
  count: number;
}

export function StreakBadge({ count }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (count > 0) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 4 }),
        withDelay(120, withSpring(1, { damping: 8 }))
      );
    }
  }, [count]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (count === 0) return null;

  return (
    <Animated.View style={[styles.badge, animStyle]}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>{count === 1 ? 'day streak' : 'day streak'}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'center',
    gap: Spacing.xs,
  },
  flame: { fontSize: FontSize.md },
  count: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.primary,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
});
