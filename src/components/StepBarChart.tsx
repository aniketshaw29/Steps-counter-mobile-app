import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { Colors, FontSize, Spacing } from '../theme';
import { shortDayLabel, isToday } from '../utils/dateHelpers';
import { DailyRecord } from '../db/database';

interface Props {
  data: DailyRecord[];
  goal: number;
}

const CHART_HEIGHT = 140;
const BAR_RADIUS = 6;

export function StepBarChart({ data, goal }: Props) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - Spacing.lg * 2;
  const barCount = 7;
  const barWidth = (chartWidth / barCount) * 0.5;
  const gap = chartWidth / barCount;

  const maxSteps = Math.max(goal, ...data.map((d) => d.steps), 1);

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={CHART_HEIGHT + 24}>
        {/* Goal line */}
        <Line
          x1={0}
          y1={CHART_HEIGHT - (goal / maxSteps) * CHART_HEIGHT}
          x2={chartWidth}
          y2={CHART_HEIGHT - (goal / maxSteps) * CHART_HEIGHT}
          stroke={Colors.barGoalLine}
          strokeWidth={1}
          strokeDasharray="4,4"
        />

        {Array.from({ length: barCount }).map((_, i) => {
          const record = data[i];
          const steps = record?.steps ?? 0;
          const dateStr = record?.date ?? '';
          const barHeight = Math.max(4, (steps / maxSteps) * CHART_HEIGHT);
          const x = i * gap + gap / 2 - barWidth / 2;
          const y = CHART_HEIGHT - barHeight;
          const active = isToday(dateStr);
          const met = steps >= goal;

          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={BAR_RADIUS}
                fill={active ? Colors.barActive : met ? Colors.primary : Colors.barInactive}
                opacity={active ? 1 : 0.75}
              />
              <SvgText
                x={x + barWidth / 2}
                y={CHART_HEIGHT + 16}
                textAnchor="middle"
                fontSize={FontSize.xs}
                fill={active ? Colors.primary : Colors.onSurfaceVariant}
                fontWeight={active ? '700' : '400'}
              >
                {dateStr ? shortDayLabel(dateStr) : ''}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
});
