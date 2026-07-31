import { Tabs } from 'expo-router';
import { useColors } from '../../src/theme/useColors';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: IoniconsName, outlineName: IoniconsName) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <Ionicons name={focused ? name : outlineName} size={24} color={color} />
  );
}

export default function TabLayout() {
  const C = useColors();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: C.surface,
          borderTopColor: C.surfaceVariant,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: { backgroundColor: C.surface },
        headerTintColor: C.onBackground,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarLabel: 'Today',
          tabBarIcon: tabIcon('footsteps', 'footsteps-outline'),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: 'History',
          tabBarIcon: tabIcon('bar-chart', 'bar-chart-outline'),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Achievements',
          tabBarLabel: 'Badges',
          tabBarIcon: tabIcon('trophy', 'trophy-outline'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: tabIcon('settings', 'settings-outline'),
        }}
      />
    </Tabs>
  );
}
