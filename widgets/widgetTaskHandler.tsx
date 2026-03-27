"use no memo";
import React from 'react';
import { WidgetTaskHandlerProps, requestWidgetUpdate } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { UrgeWidget } from './ui/UrgeWidget';
import { DashboardWidget } from './ui/DashboardWidget';
import { BadHabit, GoodHabit } from '../types';
import { WIDGET_MAPPING_KEY } from './configure/UrgeWidgetConfiguration';

const GOOD_KEY = '@habits_good';
const BAD_KEY = '@habits_bad';

export async function syncWidgets() {
  "use no memo";
  let goodHabits: GoodHabit[] = [];
  let badHabits: BadHabit[] = [];

  try {
    const [g, b] = await Promise.all([
      AsyncStorage.getItem(GOOD_KEY),
      AsyncStorage.getItem(BAD_KEY),
    ]);
    if (g) goodHabits = JSON.parse(g).filter((h: GoodHabit) => !h.archived);
    if (b) badHabits = JSON.parse(b).filter((h: BadHabit) => !h.isCompleted);
  } catch (e) {
    console.error('Error loading data for manual widget sync', e);
    return;
  }

  requestWidgetUpdate({
    widgetName: 'DashboardWidget',
    renderWidget: () => <DashboardWidget goodHabits={goodHabits} />,
    widgetNotFound: () => {},
  });

  try {
    const mappingStr = await AsyncStorage.getItem(WIDGET_MAPPING_KEY);
    if (mappingStr) {
      const mapping = JSON.parse(mappingStr);
      for (const [widgetIdStr, habitId] of Object.entries(mapping)) {
         const habit = badHabits.find(h => h.id === habitId);
         if (habit) {
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
              widgetNotFound: () => {}
            });
         }
      }
    }
  } catch (e) {
    console.error('Failed to sync UrgeWidgets explicitly', e);
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  "use no memo";
  const widgetInfo = props.widgetInfo;

  if (props.widgetAction === 'WIDGET_CLICK' && props.clickAction) {
    if (props.clickAction === 'OPEN_APP') {
      Linking.openURL('1000://');
    } else if (props.clickAction.startsWith('OPEN_URGE_HABIT_')) {
      const habitId = props.clickAction.replace('OPEN_URGE_HABIT_', '');
      Linking.openURL(`1000://bad-habit/${habitId}`);
    }
    return;
  }

  let goodHabits: GoodHabit[] = [];
  let badHabits: BadHabit[] = [];
  try {
    const [g, b] = await Promise.all([
      AsyncStorage.getItem(GOOD_KEY),
      AsyncStorage.getItem(BAD_KEY),
    ]);
    if (g) goodHabits = JSON.parse(g).filter((h: GoodHabit) => !h.archived);
    if (b) badHabits = JSON.parse(b).filter((h: BadHabit) => !h.isCompleted);
  } catch (e) {
    console.error('Error loading data for background widget handler', e);
  }

  switch (widgetInfo.widgetName) {
    case 'DashboardWidget':
      props.renderWidget(<DashboardWidget goodHabits={goodHabits} />);
      break;
    
    case 'UrgeWidget':
      try {
        const mappingStr = await AsyncStorage.getItem(WIDGET_MAPPING_KEY);
        const mapping = mappingStr ? JSON.parse(mappingStr) : {};
        const habitId = mapping[widgetInfo.widgetId];
        
        const habit = badHabits.find(h => h.id === habitId);
        
        if (habit) {
          props.renderWidget(
             <UrgeWidget 
               habitId={habit.id} 
               habitName={habit.name} 
               urgeCount={habit.urgeCount} 
               streakDays={habit.streakDays} 
             />
          );
        } else {
          props.renderWidget(<UrgeWidget habitName="Not Configured" urgeCount={0} streakDays={0} />);
        }
      } catch (e) {
         props.renderWidget(<UrgeWidget habitName="Error" urgeCount={0} streakDays={0} />);
      }
      break;
      
    default:
      console.warn(`Widget ${widgetInfo.widgetName} not handled`);
  }
}
