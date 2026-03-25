export interface DailyStats {
  date: string;
  reviews: number;
  newCards: number;
  streak?: number;
  ratingDistribution: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

export interface UpcomingReviewStats {
  date: string;
  count: number;
}

export interface AllStats {
  today: DailyStats | null;
  allTime: DailyStats[];
  cardState: Record<number, number>;
  lastNDays: DailyStats[];
  nextNDays: UpcomingReviewStats[];
}
