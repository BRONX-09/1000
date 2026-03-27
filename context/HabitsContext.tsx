import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { syncWidgets } from '../widgets/widgetTaskHandler';
import { BadHabit, DayRecord, GoodHabit, TaskRecord, TaskTemplate } from '@/types';

const GOOD_KEY = '@habits_good';
const BAD_KEY = '@habits_bad';

interface HabitsContextType {
  goodHabits: GoodHabit[];
  badHabits: BadHabit[];
  loading: boolean;

  // Good habits
  addGoodHabit: (habit: Omit<GoodHabit, 'id' | 'createdAt' | 'history' | 'streak' | 'longestStreak' | 'archived'>) => void;
  updateGoodHabit: (id: string, updates: Partial<GoodHabit>) => void;
  deleteGoodHabit: (id: string) => void;
  saveDayRecord: (habitId: string, tasks: TaskRecord[]) => void;

  // Bad habits
  addBadHabit: (habit: Omit<BadHabit, 'id' | 'urgeCount' | 'totalUrgeCount' | 'milestoneResets' | 'lastUrgeDate' | 'streakDays' | 'lastActiveDate' | 'isCompleted'>) => void;
  updateBadHabit: (id: string, updates: Partial<BadHabit>) => void;
  deleteBadHabit: (id: string) => void;
  incrementUrge: (id: string) => { newCount: number; hitMilestone: boolean };
  completeBadHabit: (id: string) => void;
  extendBadHabit: (id: string, days: number) => void;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

function uuid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [goodHabits, setGoodHabits] = useState<GoodHabit[]>([]);
  const [badHabits, setBadHabits] = useState<BadHabit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [g, b] = await Promise.all([
          AsyncStorage.getItem(GOOD_KEY),
          AsyncStorage.getItem(BAD_KEY),
        ]);
        if (g) setGoodHabits(JSON.parse(g));
        if (b) setBadHabits(JSON.parse(b));
      } catch (e) {
        console.warn('HabitsContext load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistGood = useCallback(async (habits: GoodHabit[]) => {
    setGoodHabits(habits);
    await AsyncStorage.setItem(GOOD_KEY, JSON.stringify(habits));
    await syncWidgets();
  }, []);

  const persistBad = useCallback(async (habits: BadHabit[]) => {
    setBadHabits(habits);
    await AsyncStorage.setItem(BAD_KEY, JSON.stringify(habits));
    await syncWidgets();
  }, []);

  // ── GOOD HABITS ──────────────────────────────────────────
  const addGoodHabit = useCallback(
    (partial: Omit<GoodHabit, 'id' | 'createdAt' | 'history' | 'streak' | 'longestStreak' | 'archived'>) => {
      const newHabit: GoodHabit = {
        ...partial,
        id: uuid(),
        createdAt: new Date().toISOString(),
        history: [],
        streak: 0,
        longestStreak: 0,
        archived: false,
      };
      persistGood([...goodHabits, newHabit]);
    },
    [goodHabits, persistGood]
  );

  const updateGoodHabit = useCallback(
    (id: string, updates: Partial<GoodHabit>) => {
      persistGood(goodHabits.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    },
    [goodHabits, persistGood]
  );

  const deleteGoodHabit = useCallback(
    (id: string) => {
      persistGood(goodHabits.filter((h) => h.id !== id));
    },
    [goodHabits, persistGood]
  );

  const saveDayRecord = useCallback(
    (habitId: string, tasks: TaskRecord[]) => {
      const today = todayStr();
      const completedCount = tasks.filter((t) => t.completed).length;
      const totalCount = tasks.length;
      const completed = totalCount > 0 && completedCount === totalCount;

      const newRecord: DayRecord = {
        date: today,
        completed,
        completedCount,
        totalCount,
        tasks,
      };

      const updated = goodHabits.map((h) => {
        if (h.id !== habitId) return h;
        const filtered = h.history.filter((d) => d.date !== today);
        const newHistory = [...filtered, newRecord];

        // Recalculate streak
        const sorted = newHistory
          .filter((d) => d.completed)
          .map((d) => d.date)
          .sort()
          .reverse();

        let streak = 0;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (sorted[0] === today || sorted[0] === yesterday) {
          streak = 1;
          for (let i = 0; i < sorted.length - 1; i++) {
            const diff =
              (new Date(sorted[i]).getTime() - new Date(sorted[i + 1]).getTime()) /
              86400000;
            if (Math.round(diff) === 1) streak++;
            else break;
          }
        }

        return {
          ...h,
          history: newHistory,
          streak,
          longestStreak: Math.max(h.longestStreak, streak),
        };
      });

      persistGood(updated);
    },
    [goodHabits, persistGood]
  );

  // ── BAD HABITS ──────────────────────────────────────────
  const addBadHabit = useCallback(
    (partial: Omit<BadHabit, 'id' | 'urgeCount' | 'totalUrgeCount' | 'milestoneResets' | 'lastUrgeDate' | 'streakDays' | 'lastActiveDate' | 'isCompleted'>) => {
      const newHabit: BadHabit = {
        ...partial,
        id: uuid(),
        urgeCount: 0,
        totalUrgeCount: 0,
        milestoneResets: 0,
        lastUrgeDate: '',
        streakDays: 0,
        lastActiveDate: todayStr(),
        isCompleted: false,
      };
      persistBad([...badHabits, newHabit]);
    },
    [badHabits, persistBad]
  );

  const updateBadHabit = useCallback(
    (id: string, updates: Partial<BadHabit>) => {
      persistBad(badHabits.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    },
    [badHabits, persistBad]
  );

  const deleteBadHabit = useCallback(
    (id: string) => {
      persistBad(badHabits.filter((h) => h.id !== id));
    },
    [badHabits, persistBad]
  );

  const incrementUrge = useCallback(
    (id: string): { newCount: number; hitMilestone: boolean } => {
      let newCount = 0;
      let hitMilestone = false;

      const updated = badHabits.map((h) => {
        if (h.id !== id) return h;
        const today = todayStr();

        // Calculate clean streak
        let streakDays = h.streakDays;
        if (h.lastActiveDate && h.lastActiveDate !== today) {
          const daysSince =
            (new Date(today).getTime() - new Date(h.lastActiveDate).getTime()) /
            86400000;
          streakDays = h.streakDays + Math.floor(daysSince);
        }

        const next = h.urgeCount + 1;
        const total = h.totalUrgeCount + 1;
        const milestones = [100, 250, 500, 750, 1000];

        if (next >= 1000) {
          hitMilestone = true;
          newCount = 0;
          return {
            ...h,
            urgeCount: 0,
            totalUrgeCount: total,
            milestoneResets: h.milestoneResets + 1,
            lastUrgeDate: today,
            lastActiveDate: today,
            streakDays,
          };
        }

        hitMilestone = milestones.includes(next);
        newCount = next;

        return {
          ...h,
          urgeCount: next,
          totalUrgeCount: total,
          lastUrgeDate: today,
          lastActiveDate: today,
          streakDays,
        };
      });

      persistBad(updated);
      return { newCount, hitMilestone };
    },
    [badHabits, persistBad]
  );

  const completeBadHabit = useCallback(
    (id: string) => {
      persistBad(badHabits.map((h) => (h.id === id ? { ...h, isCompleted: true } : h)));
    },
    [badHabits, persistBad]
  );

  const extendBadHabit = useCallback(
    (id: string, days: number) => {
      persistBad(
        badHabits.map((h) =>
          h.id === id
            ? { ...h, targetDays: h.targetDays + days, extensionDays: days }
            : h
        )
      );
    },
    [badHabits, persistBad]
  );

  return (
    <HabitsContext.Provider
      value={{
        goodHabits,
        badHabits,
        loading,
        addGoodHabit,
        updateGoodHabit,
        deleteGoodHabit,
        saveDayRecord,
        addBadHabit,
        updateBadHabit,
        deleteBadHabit,
        incrementUrge,
        completeBadHabit,
        extendBadHabit,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits must be inside HabitsProvider');
  return ctx;
}
