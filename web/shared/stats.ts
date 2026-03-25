// Stats interfaces - unified with extension version format
// Extension uses: totalReviews, gradeBreakdown: {1,2,3,4}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  totalReviews: number;
  gradeBreakdown: {
    1: number; // Again
    2: number; // Hard
    3: number; // Good
    4: number; // Easy
  };
  newCards: number;
  reviewedCards: number;
  streak: number;
}

export interface MonthlyStats extends Omit<DailyStats, 'date'> {
  month: string; // YYYY-MM format
  activeDays: number;
}

export interface UpcomingReviewStats {
  date: string; // YYYY-MM-DD format
  count: number;
}

export interface AllStats {
  today: DailyStats | null;
  allTime: DailyStats[];
  cardState: Record<number, number>;
  lastNDays: DailyStats[];
  nextNDays: UpcomingReviewStats[];
}
