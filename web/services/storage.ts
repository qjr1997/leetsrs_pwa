import type { Card, Difficulty, LeetcodeDomain } from '../shared/cards';
import type { Grade } from 'ts-fsrs';
import type { DailyStats } from '../shared/stats';
import type { Note } from '../shared/notes';
import type { Theme, Language } from '../shared/settings';
import type { GistSyncConfig, GistSyncStatus } from '../shared/gist-sync';

const STORAGE_PREFIX = 'leetsrs_web_';

export const STORAGE_KEYS = {
  cards: `${STORAGE_PREFIX}cards`,
  stats: `${STORAGE_PREFIX}stats`,
  monthlyStats: `${STORAGE_PREFIX}monthlyStats`,
  notes: `${STORAGE_PREFIX}notes`,
  maxNewCardsPerDay: `${STORAGE_PREFIX}maxNewCardsPerDay`,
  dayStartHour: `${STORAGE_PREFIX}dayStartHour`,
  animationsEnabled: `${STORAGE_PREFIX}animationsEnabled`,
  theme: `${STORAGE_PREFIX}theme`,
  autoClearLeetcode: `${STORAGE_PREFIX}autoClearLeetcode`,
  badgeEnabled: `${STORAGE_PREFIX}badgeEnabled`,
  language: `${STORAGE_PREFIX}language`,
  dataUpdatedAt: `${STORAGE_PREFIX}dataUpdatedAt`,
  githubPat: `${STORAGE_PREFIX}githubPat`,
  gistId: `${STORAGE_PREFIX}gistId`,
  gistSyncEnabled: `${STORAGE_PREFIX}gistSyncEnabled`,
  lastSyncTime: `${STORAGE_PREFIX}lastSyncTime`,
  lastSyncDirection: `${STORAGE_PREFIX}lastSyncDirection`,
} as const;

export function getNoteStorageKey(cardId: string): string {
  return `${STORAGE_KEYS.notes}:${cardId}`;
}

export const storage = {
  getItem: async <T,>(key: string): Promise<T | null> => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  setItem: async <T,>(key: string, value: T): Promise<void> => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
  },
};