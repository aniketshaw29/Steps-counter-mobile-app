import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, FontSize, Spacing, Radius } from '../theme';

interface Props {
  visible: boolean;
  steps: number;
  onDone: () => void;
}

export function GoalCelebration({ visible, steps, onDone }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 6 });
      // Auto-dismiss after 3 seconds
      opacity.value = withDelay(2700, withTiming(0, { duration: 300 }, (done) => {
        if (done) runOnJS(onDone)();
      }));
    } else {
      opacity.value = 0;
      scale.value = 0.5;
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View style={[styles.overlay, containerStyle]}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Goal Reached!</Text>
          <Text style={styles.subtitle}>{steps.toLocaleString()} steps today</Text>
          <Text style={styles.congrats}>Keep it up!</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  emoji: { fontSize: 56, marginBottom: Spacing.md },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  congrats: {
    fontSize: FontSize.sm,
    color: Colors.onSurfaceVariant,
    marginTop: Spacing.sm,
  },
});
