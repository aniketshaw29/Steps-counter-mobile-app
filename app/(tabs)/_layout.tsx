import { Tabs } from 'expo-router';
import { Colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.surfaceVariant,
          elevation: 0,
        },
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.onBackground,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Today', tabBarLabel: 'Today' }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'History', tabBarLabel: 'History' }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarLabel: 'Settings' }}
      />
    </Tabs>
  );
}
