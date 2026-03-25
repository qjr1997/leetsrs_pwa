// Storage keys for web version
export const STORAGE_KEYS = {
  // Data keys
  cards: 'leetsrs_web_cards',
  stats: 'leetsrs_web_stats',
  monthlyStats: 'leetsrs_web_monthly_stats',
  notes: 'leetsrs_web_notes',
  
  // Settings keys
  maxNewCardsPerDay: 'leetsrs_web_max_new_cards',
  dayStartHour: 'leetsrs_web_day_start_hour',
  animationsEnabled: 'leetsrs_web_animations_enabled',
  theme: 'leetsrs_web_theme',
  autoClearLeetcode: 'leetsrs_web_auto_clear_leetcode',
  badgeEnabled: 'leetsrs_web_badge_enabled',
  language: 'leetsrs_web_language',
  
  // Gist sync keys
  githubPat: 'leetsrs_web_github_pat',
  gistId: 'leetsrs_web_gist_id',
  gistSyncEnabled: 'leetsrs_web_gist_sync_enabled',
  lastSyncTime: 'leetsrs_web_last_sync_time',
  lastSyncDirection: 'leetsrs_web_last_sync_direction',
  dataUpdatedAt: 'leetsrs_web_data_updated_at',
} as const;