"use no memo";
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface UrgeWidgetProps {
  habitId?: string;
  habitName: string;
  urgeCount: number;
  streakDays: number;
}

export function UrgeWidget({ habitId, habitName, urgeCount, streakDays }: UrgeWidgetProps) {
  "use no memo";
  return (
    <FlexWidget
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1C1C1E', // Dark sleek background
        borderRadius: 24,
        padding: 8,
      }}
      clickAction={habitId ? `OPEN_URGE_HABIT_${habitId}` : "OPEN_APP"}
    >
      <TextWidget
        text={habitName || 'No Habit Selected'}
        style={{ fontSize: 14, color: '#EBEBF599', marginBottom: 8, fontWeight: 'bold' }}
      />
      
      <FlexWidget
        style={{
          backgroundColor: '#FF3B30', // Vibrant Red
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 8,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 6,
        }}
      >
        <TextWidget
          text={`${urgeCount} / 1000`}
          style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' }}
        />
      </FlexWidget>
      
      {streakDays > 0 && (
        <TextWidget
          text={`🔥 ${streakDays} Clean Days`}
          style={{ fontSize: 12, color: '#30D158', fontWeight: 'bold' }}
        />
      )}
    </FlexWidget>
  );
}
