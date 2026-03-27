"use no memo";
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { GoodHabit } from '../../types';

interface DashboardWidgetProps {
  goodHabits: GoodHabit[];
}

export function DashboardWidget({ goodHabits = [] }: DashboardWidgetProps) {
  "use no memo";
  const today = new Date().toISOString().split('T')[0];
  const items = goodHabits.slice(0, 3); // show up to 3
  
  return (
    <FlexWidget
      style={{
        flexDirection: 'column',
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        padding: 16,
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget
        text="Daily Check-in 🌱"
        style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 12 }}
      />
      
      {items.length === 0 ? (
        <FlexWidget style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextWidget
            text="No active habits yet."
            style={{ fontSize: 14, color: '#EBEBF599' }}
          />
        </FlexWidget>
      ) : (
        items.map(habit => {
          const todayRecord = habit.history?.find(h => h.date === today);
          const completedTasks = todayRecord?.completedCount || 0;
          const totalTasks = todayRecord?.totalCount || habit.tasks.length;
          const isDone = totalTasks > 0 && completedTasks === totalTasks;
          
          return (
            <FlexWidget
              key={habit.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 4,
                backgroundColor: '#2C2C2E',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
              }}
            >
              <TextWidget
                text={`${habit.icon} ${habit.name}`}
                style={{ fontSize: 14, color: '#EBEBF5' }}
              />
              <TextWidget
                text={`${completedTasks}/${totalTasks}`}
                style={{ 
                  fontSize: 14, 
                  color: isDone ? '#30D158' : '#EBEBF599',
                  fontWeight: 'bold'
                }}
              />
            </FlexWidget>
          )
        })
      )}
      
      {goodHabits.length > 3 && (
        <FlexWidget style={{ width: 'match_parent', justifyContent: 'center', marginTop: 8 }}>
          <TextWidget
             text={`+ ${goodHabits.length - 3} more habits`}
             style={{ fontSize: 12, color: '#EBEBF580' }}
          />
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
