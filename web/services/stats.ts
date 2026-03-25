import { STORAGE_KEYS, storage } from './storage';
import type { DailyStats, UpcomingReviewStats } from '../shared/stats';
import type { Grade, State as FsrsState } from 'ts-fsrs';
import { getAllCards } from './cards';
import { formatLocalDate } from '../utils/date';

export async function getTodayStats(): Promise<DailyStats | null> {
  const today = formatLocalDate(new Date(), await getDayStartHour());
  const monthlyStats = await getMonthlyStats();
  const stats = monthlyStats[today];
  if (stats) {
    stats.streak = await calculateStreak();
  }
  return stats || null;
}

export async function calculateStreak(): Promise<number> {
  const monthlyStats = await getMonthlyStats();
  const allStats = Object.values(monthlyStats).sort((a, b) => a.date.localeCompare(b.date));
  
  if (allStats.length === 0) return 0;
  
  const today = formatLocalDate(new Date(), await getDayStartHour());
  const dayStartHour = await getDayStartHour();
  
  let streak = 0;
  let currentDate = new Date();
  
  // Check if we've reviewed today
  const todayStats = monthlyStats[today];
  if (todayStats && todayStats.reviews > 0) {
    streak = 1;
  }
  
  // Go backwards to count consecutive days
  while (true) {
    currentDate.setDate(currentDate.getDate() - 1);
    const dateStr = formatLocalDate(currentDate, dayStartHour);
    const dayStats = monthlyStats[dateStr];
    
    if (dayStats && dayStats.reviews > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export async function getCardStateStats(): Promise<Record<FsrsState, number>> {
  const cards = await getAllCards();
  const stats: Record<number, number> = {
    [FsrsState.New]: 0,
    [FsrsState.Learning]: 0,
    [FsrsState.Review]: 0,
    [FsrsState.Relearning]: 0,
  };
  
  cards.forEach(card => {
    stats[card.fsrs.state] = (stats[card.fsrs.state] || 0) + 1;
  });
  
  return stats as Record<FsrsState, number>;
}

export async function getAllStats(): Promise<DailyStats[]> {
  const monthlyStats = await getMonthlyStats();
  return Object.values(monthlyStats).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getLastNDaysStats(days: number): Promise<DailyStats[]> {
  const allStats = await getAllStats();
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - days);
  
  return allStats.filter(stat => new Date(stat.date) >= cutoff);
}

export async function getNextNDaysStats(days: number): Promise<UpcomingReviewStats[]> {
  const cards = await getAllCards();
  const stats: Record<string, number> = {};
  const today = new Date();
  const dayStartHour = await getDayStartHour();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = formatLocalDate(date, dayStartHour);
    stats[dateStr] = 0;
  }
  
  cards.forEach(card => {
    if (card.paused) return;
    const dueDate = formatLocalDate(card.fsrs.due, dayStartHour);
    if (stats[dueDate] !== undefined) {
      stats[dueDate]++;
    }
  });
  
  return Object.entries(stats).map(([date, count]) => ({ date, count }));
}

export async function updateStats(rating: Grade, isNewCard: boolean): Promise<void> {
  const today = formatLocalDate(new Date(), await getDayStartHour());
  const monthlyStats = await getMonthlyStats();
  
  if (!monthlyStats[today]) {
    monthlyStats[today] = {
      date: today,
      reviews: 0,
      newCards: 0,
      ratingDistribution: {
        again: 0,
        hard: 0,
        good: 0,
        easy: 0,
      },
    };
  }
  
  const todayStats = monthlyStats[today];
  todayStats.reviews++;
  
  if (isNewCard) {
    todayStats.newCards++;
  }
  
  const ratingMap: Record<number, keyof DailyStats['ratingDistribution']> = {
    1: 'again',
    2: 'hard',
    3: 'good',
    4: 'easy',
  };
  
  const ratingKey = ratingMap[rating];
  if (ratingKey) {
    todayStats.ratingDistribution[ratingKey]++;
  }
  
  await saveMonthlyStats(monthlyStats);
}

// Import settings function to avoid circular dependency
async function getDayStartHour(): Promise<number> {
  const { getDayStartHour } = await import('./settings');
  return getDayStartHour();
}

async function getMonthlyStats(): Promise<Record<string, DailyStats>> {
  const stats = await storage.getItem<Record<string, DailyStats>>(STORAGE_KEYS.monthlyStats);
  return stats ?? {};
}

async function saveMonthlyStats(stats: Record<string, DailyStats>): Promise<void> {
  await storage.setItem(STORAGE_KEYS.monthlyStats, stats);
}
