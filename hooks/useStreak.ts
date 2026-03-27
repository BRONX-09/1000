import { DayRecord, GoodHabit } from '@/types';
import { useMemo } from 'react';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.round(Math.abs(da - db) / 86400000);
}

export function useStreak(history: DayRecord[]) {
  return useMemo(() => {
    const completed = history
      .filter((d) => d.completed)
      .map((d) => d.date)
      .sort()
      .reverse();

    if (completed.length === 0) return { current: 0, longest: 0 };

    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 86400000));

    // Streak must include today or yesterday
    if (completed[0] !== today && completed[0] !== yesterday) {
      return { current: 0, longest: calcLongest(completed) };
    }

    let current = 1;
    for (let i = 0; i < completed.length - 1; i++) {
      if (daysBetween(completed[i], completed[i + 1]) === 1) {
        current++;
      } else {
        break;
      }
    }

    return { current, longest: Math.max(current, calcLongest(completed)) };
  }, [history]);
}

function calcLongest(sorted: string[]): number {
  if (sorted.length === 0) return 0;
  let max = 1;
  let cur = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (daysBetween(sorted[i], sorted[i + 1]) === 1) {
      cur++;
      max = Math.max(max, cur);
    } else {
      cur = 1;
    }
  }
  return max;
}

export function getTodayRecord(habit: GoodHabit): DayRecord | undefined {
  const today = new Date().toISOString().split('T')[0];
  return habit.history.find((d) => d.date === today);
}

export function calcBadHabitStreak(lastActiveDate: string, startDate: string): number {
  const today = new Date().toISOString().split('T')[0];
  const ref = lastActiveDate || startDate;
  return daysBetween(ref, today);
}
