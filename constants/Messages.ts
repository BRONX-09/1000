export const URGE_MESSAGES = [
  'You\'ve got this 💪',
  'One less hold it has on you.',
  'Every NO rewrites your brain.',
  'Strength builds here.',
  'That one counts. Keep going.',
  'You\'re stronger than this urge.',
  'Future you is grateful.',
  'That\'s real power.',
  'The urge is temporary. You\'re not.',
  'No is the most powerful word.',
  'You just won a battle.',
  'This is freedom.',
  'One step closer to unshakeable.',
  'The old you is fading.',
  'You made the right call.',
  'Progress, not perfection.',
  'This is who you\'re becoming.',
  'Another one bites the dust 🔥',
  'Keep this energy.',
  'Days like these define you.',
];

export const STREAK_MESSAGES: Record<number, string> = {
  1: 'Day one. It begins. 🌱',
  3: 'Three days strong. This is real! 🔥',
  7: 'One full week! You\'re unstoppable. ⚡',
  14: 'Two weeks. The habit is forming.',
  21: '21 days. You\'ve rewired your brain. 🏆',
  30: 'A whole month. Legendary. 👑',
  50: '50 days. You\'re a different person. ✨',
  100: '100 days. A true master. 🎯',
};

export const GOOD_HABIT_STREAKS: Record<number, string> = {
  1: 'Great start! 🌱',
  3: 'Three in a row! Keep it up 🔥',
  7: 'A full week! You\'re on fire ⚡',
  14: 'Two weeks of consistency. Habit locked in.',
  21: '21 days — it\'s now a part of you 🏆',
  30: 'A month strong. You\'re built different 👑',
  50: '50 days. Pure discipline. ✨',
  100: '100 day streak. Legendary. 🎯',
};

export const MILESTONE_MESSAGES: Record<number, string> = {
  100: 'First 100 NOs. You\'re different now.',
  250: '250 resistances. The tide is turning.',
  500: 'Halfway there. Halfway FREE.',
  750: '750 times you chose yourself.',
  1000: 'ONE THOUSAND NOs. You\'ve broken the habit. You won. 🎉',
};

export const COMPLETION_MESSAGES = [
  'You said NO enough times to rewrite your story.',
  'The battle is over. You won.',
  'This habit no longer owns you.',
  'Discipline, day by day. That\'s how it\'s done.',
];

export function getRandomUrgeMessage(): string {
  return URGE_MESSAGES[Math.floor(Math.random() * URGE_MESSAGES.length)];
}

export function getStreakMessage(streak: number): string | null {
  const milestones = [100, 50, 30, 21, 14, 7, 3, 1];
  for (const m of milestones) {
    if (streak === m) return STREAK_MESSAGES[m] ?? null;
  }
  return null;
}

export function getGoodHabitStreakMessage(streak: number): string | null {
  const milestones = [100, 50, 30, 21, 14, 7, 3, 1];
  for (const m of milestones) {
    if (streak === m) return GOOD_HABIT_STREAKS[m] ?? null;
  }
  return null;
}
