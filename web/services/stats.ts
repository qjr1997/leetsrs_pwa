import { STORAGE_KEYS, storage } from './storage';
import type { DailyStats, MonthlyStats, UpcomingReviewStats } from '../shared/stats';
import type { Grade, State as FsrsState } from 'ts-fsrs';
import { getAllCards } from './cards';
import { formatLocalDate } from '../utils/date';

// Rating constants matching extension
const Rating = {
  Again: 1,
  Hard: 2,
  Good: 3,
  Easy: 4,
} as const;

function createEmptyDailyStats(): DailyStats {
  return {
    totalReviews: 0,
    gradeBreakdown: {
      [Rating.Again]: 0,
      [Rating.Hard]: 0,
      [Rating.Good]: 0,
      [Rating.Easy]: 0,
    },
    newCards: 0,
    reviewedCards: 0,
    date: '',
    streak: 0,
  };
}

// Get daily stats from extension-compatible storage key
async function getStats(): Promise<Record<string, DailyStats>> {
  const stats = await storage.getItem<Record<string, DailyStats>>(STORAGE_KEYS.stats);
  return stats ?? {};
}

export async function getMonthlyStats(): Promise<Record<string, MonthlyStats>> {
  // Extension stores monthly stats separately, but we use the same format
  // For simplicity, we derive monthly from daily stats
  const dailyStats = await getStats();
  const monthly: Record<string, MonthlyStats> = {};
  
  for (const [date, stats] of Object.entries(dailyStats)) {
    const monthKey = date.slice(0, 7); // YYYY-MM
    if (!monthly[monthKey]) {
      monthly[monthKey] = {
        ...createEmptyDailyStats(),
        month: monthKey,
        activeDays: 0,
      };
    }
    
    const m = monthly[monthKey];
    m.totalReviews += stats.totalReviews;
    m.gradeBreakdown[Rating.Again] += stats.gradeBreakdown[Rating.Again];
    m.gradeBreakdown[Rating.Hard] += stats.gradeBreakdown[Rating.Hard];
    m.gradeBreakdown[Rating.Good] += stats.gradeBreakdown[Rating.Good];
    m.gradeBreakdown[Rating.Easy] += stats.gradeBreakdown[Rating.Easy];
    m.newCards += stats.newCards;
    m.reviewedCards += stats.reviewedCards;
    m.activeDays += 1;
  }
  
  return monthly;
}

// Import settings function to avoid circular dependency
async function getDayStartHour(): Promise<number> {
  const { getDayStartHour } = await import('./settings');
  return getDayStartHour();
}

export async function getTodayKey(): Promise<string> {
  const now = new Date();
  const dayStartHour = await getDayStartHour();
  return formatLocalDate(now, dayStartHour);
}

export async function getYesterdayKey(): Promise<string> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dayStartHour = await getDayStartHour();
  return formatLocalDate(yesterday, dayStartHour);
}

export async function updateStats(grade: Grade, isNewCard: boolean = false): Promise<void> {
  const stats = await getStats();
  const todayKey = await getTodayKey();

  if (!stats[todayKey]) {
    const yesterdayKey = await getYesterdayKey();
    const yesterdayStats = stats[yesterdayKey];
    const streak = yesterdayStats ? yesterdayStats.streak + 1 : 1;

    stats[todayKey] = {
      ...createEmptyDailyStats(),
      date: todayKey,
      streak,
    };
  }

  const todayStats = stats[todayKey];
  todayStats.totalReviews++;
  todayStats.gradeBreakdown[grade as keyof typeof todayStats.gradeBreakdown]++;

  if (isNewCard) {
    todayStats.newCards++;
  } else {
    todayStats.reviewedCards++;
  }

  await storage.setItem(STORAGE_KEYS.stats, stats);
}

export async function getStatsForDate(date: string): Promise<DailyStats | null> {
  const stats = await getStats();
  return stats[date] ?? null;
}

export async function getTodayStats(): Promise<DailyStats | null> {
  return getStatsForDate(await getTodayKey());
}

export async function getAllStats(): Promise<DailyStats[]> {
  const stats = await getStats();
  return Object.values(stats).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getCardStateStats(): Promise<Record<FsrsState, number>> {
  const cards = await getAllCards();
  const stateStats: Record<FsrsState, number> = {
    [FsrsState.New]: 0,
    [FsrsState.Learning]: 0,
    [FsrsState.Review]: 0,
    [FsrsState.Relearning]: 0,
  };

  for (const card of cards) {
    const state = card.fsrs.state;
    stateStats[state]++;
  }

  return stateStats;
}

export async function getLastNDaysStats(days: number): Promise<DailyStats[]> {
  const stats = await getStats();
  const result: DailyStats[] = [];
  const today = new Date();
  const dayStartHour = await getDayStartHour();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = formatLocalDate(date, dayStartHour);

    if (stats[dateKey]) {
      result.push(stats[dateKey]);
    } else {
      // Include empty days for continuity in the chart
      result.push({
        ...createEmptyDailyStats(),
        date: dateKey,
        streak: 0,
      });
    }
  }

  return result;
}

export async function getNextNDaysStats(days: number): Promise<UpcomingReviewStats[]> {
  const cards = await getAllCards();
  const result: UpcomingReviewStats[] = [];
  const today = new Date();
  const dayStartHour = await getDayStartHour();

  // Initialize result array with dates
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    result.push({
      date: formatLocalDate(date, dayStartHour),
      count: 0,
    });
  }

  // Count cards due on each day
  for (const card of cards) {
    if (card.paused) continue;
    
    // Find the first day this card is due
    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() + i);
      
      // Simple due date check - compare date strings
      const dueDate = new Date(card.fsrs.due);
      const dueDateStr = formatLocalDate(dueDate, dayStartHour);
      const checkDateStr = formatLocalDate(checkDate, dayStartHour);
      
      if (dueDateStr === checkDateStr) {
        result[i].count++;
        break;
      }
    }
  }

  return result;
}

// Calculate streak from stats
export async function calculateStreak(): Promise<number> {
  const stats = await getStats();
  const todayKey = await getTodayKey();
  const dayStartHour = await getDayStartHour();
  
  let streak = 0;
  let currentDate = new Date();
  
  // Check today
  if (stats[todayKey] && stats[todayKey].totalReviews > 0) {
    streak = 1;
  }
  
  // Go backwards
  while (true) {
    currentDate.setDate(currentDate.getDate() - 1);
    const dateKey = formatLocalDate(currentDate, dayStartHour);
    const dayStats = stats[dateKey];
    
    if (dayStats && dayStats.totalReviews > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
