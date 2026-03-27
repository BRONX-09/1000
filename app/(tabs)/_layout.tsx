import { Colors, FontSize, Spacing } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

function TabIcon({ name, label, focused, color }: { name: any; label: string; focused: boolean; color: string }) {
  return (
    <View style={styles.tabItem}>
      <Ionicons name={name} size={22} color={focused ? color : Colors.textMuted} />
      <Text style={[styles.tabLabel, { color: focused ? color : Colors.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.teal,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} label="Home" focused={focused} color={Colors.teal} />
          ),
        }}
      />
      <Tabs.Screen
        name="good-habits"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'leaf' : 'leaf-outline'} label="Build" focused={focused} color={Colors.teal} />
          ),
        }}
      />
      <Tabs.Screen
        name="bad-habits"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'shield' : 'shield-outline'} label="Break" focused={focused} color={Colors.red} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 8,
    elevation: 0,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
