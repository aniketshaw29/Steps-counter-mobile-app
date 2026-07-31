import { Tabs } from 'expo-router';
import { useColors } from '../../src/theme/useColors';

export default function TabLayout() {
  const C = useColors();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.onSurfaceVariant,
        tabBarStyle: { backgroundColor: C.surface, borderTopColor: C.surfaceVariant, elevation: 0 },
        headerStyle: { backgroundColor: C.surface },
        headerTintColor: C.onBackground,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="index"        options={{ title: 'Today',        tabBarLabel: 'Today' }} />
      <Tabs.Screen name="history"      options={{ title: 'History',      tabBarLabel: 'History' }} />
      <Tabs.Screen name="achievements" options={{ title: 'Achievements', tabBarLabel: 'Badges' }} />
      <Tabs.Screen name="settings"     options={{ title: 'Settings',     tabBarLabel: 'Settings' }} />
    </Tabs>
  );
}
