export interface TaskTemplate {
  id: string;
  label: string;
}

export interface TaskRecord {
  id: string;
  label: string;
  completed: boolean;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedCount: number;
  totalCount: number;
  tasks: TaskRecord[];
}

export interface GoodHabit {
  id: string;
  name: string;
  icon: string;
  color: string;
  tasks: TaskTemplate[];
  createdAt: string;
  history: DayRecord[];
  streak: number;
  longestStreak: number;
  archived: boolean;
}

export interface BadHabit {
  id: string;
  name: string;
  icon: string;
  color: string;
  startDate: string;
  targetDays: number;
  urgeCount: number;
  totalUrgeCount: number;
  milestoneResets: number;
  lastUrgeDate: string;
  streakDays: number;
  lastActiveDate: string;
  isCompleted: boolean;
  extendAfter21: boolean;
  extensionDays: number;
}

export interface MilestoneBadge {
  count: number;
  label: string;
  icon: string;
  earnedAt?: string;
}
