import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WidgetConfigurationScreenProps, requestWidgetUpdate } from 'react-native-android-widget';
import { UrgeWidget } from '../ui/UrgeWidget';
import { BadHabit } from '../../types';

const BAD_KEY = '@habits_bad';
export const WIDGET_MAPPING_KEY = '@widget_habit_mapping';

export default function UrgeWidgetConfiguration({
  widgetInfo,
  setResult,
}: WidgetConfigurationScreenProps) {
  const [habits, setHabits] = useState<BadHabit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(BAD_KEY).then((data) => {
      if (data) {
        setHabits(JSON.parse(data).filter((h: BadHabit) => !h.isCompleted));
      }
      setLoading(false);
    });
  }, []);

  const onSelect = async (habit: BadHabit) => {
    // Save mapping: widgetId -> habitId
    try {
      const mappingData = await AsyncStorage.getItem(WIDGET_MAPPING_KEY);
      const mapping = mappingData ? JSON.parse(mappingData) : {};
      mapping[widgetInfo.widgetId] = habit.id;
      await AsyncStorage.setItem(WIDGET_MAPPING_KEY, JSON.stringify(mapping));

      // Instruct Android to draw the specific widget
      requestWidgetUpdate({
        widgetName: 'UrgeWidget',
        renderWidget: () => (
          <UrgeWidget 
            habitId={habit.id} 
            habitName={habit.name} 
            urgeCount={habit.urgeCount} 
            streakDays={habit.streakDays} 
          />
        ),
        widgetNotFound: () => {},
      });

      setResult('ok');
    } catch (e) {
      console.error('Failed to configure widget', e);
      setResult('cancel');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator color="#FF3B30" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Habit to Track</Text>
      <Text style={styles.subtitle}>Which urge do you want quick access to?</Text>
      
      {habits.length === 0 ? (
        <Text style={styles.emptyText}>No active bad habits found. Create one in the app first!</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
              <Text style={styles.emoji}>{item.icon}</Text>
              <View style={styles.itemDetails}>
                 <Text style={styles.name}>{item.name}</Text>
                 <Text style={styles.details}>{item.urgeCount} / 1000  •  🔥 {item.streakDays}d</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
    padding: 24,
  },
  title: {
    color: '#EBEBF5',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20
  },
  subtitle: {
    color: '#EBEBF5',
    opacity: 0.6,
    fontSize: 14,
    marginBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemDetails: {
    marginLeft: 16,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  emptyText: {
    color: '#EBEBF5',
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 40,
  }
});
