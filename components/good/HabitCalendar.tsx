import { Colors, FontSize, Radius, Spacing } from '@/constants/Colors';
import { DayRecord, GoodHabit } from '@/types';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface HabitCalendarProps {
  habit: GoodHabit;
}

function getColorForDay(record?: DayRecord, accentColor: string = Colors.teal): string {
  if (!record) return Colors.surface3;
  const ratio = record.totalCount > 0 ? record.completedCount / record.totalCount : 0;
  if (ratio === 0) return Colors.surface3;
  if (ratio < 0.4) return accentColor + '40';
  if (ratio < 0.7) return accentColor + '80';
  if (ratio < 1) return accentColor + 'BB';
  return accentColor;
}

function getWeeksForMonth(year: number, month: number) {
  const weeks: (Date | null)[][] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let week: (Date | null)[] = Array(firstDay.getDay()).fill(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

export function HabitCalendar({ habit }: HabitCalendarProps) {
  const historyMap = useMemo(() => {
    const map: Record<string, DayRecord> = {};
    for (const d of habit.history) map[d.date] = d;
    return map;
  }, [habit.history]);

  const months = useMemo(() => {
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push({ year: d.getFullYear(), month: d.getMonth() });
    }
    return result;
  }, []);

  const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {months.map(({ year, month }) => {
        const weeks = getWeeksForMonth(year, month);
        return (
          <View key={`${year}-${month}`} style={styles.monthBlock}>
            <Text style={styles.monthLabel}>{MONTH_NAMES[month]} {year}</Text>
            {/* Day headers */}
            <View style={styles.row}>
              {DAYS.map((d, i) => (
                <Text key={i} style={styles.dayHeader}>{d}</Text>
              ))}
            </View>
            {/* Weeks */}
            {weeks.map((week, wi) => (
              <View key={wi} style={styles.row}>
                {week.map((date, di) => {
                  if (!date) return <View key={di} style={styles.cell} />;
                  const key = date.toISOString().split('T')[0];
                  const record = historyMap[key];
                  const today = new Date().toISOString().split('T')[0];
                  const isToday = key === today;
                  const bg = getColorForDay(record, habit.color);
                  return (
                    <View
                      key={di}
                      style={[
                        styles.cell,
                        { backgroundColor: bg },
                        isToday && styles.today,
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const CELL = 14;
const GAP = 3;

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },
  monthBlock: {
    gap: GAP,
  },
  monthLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
  dayHeader: {
    width: CELL,
    fontSize: 8,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 3,
    backgroundColor: Colors.surface3,
  },
  today: {
    borderWidth: 1.5,
    borderColor: Colors.white + '80',
  },
});
