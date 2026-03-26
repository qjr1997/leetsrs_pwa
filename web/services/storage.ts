import type { Card, Difficulty, LeetcodeDomain } from '../shared/cards';
import type { Grade } from 'ts-fsrs';
import type { DailyStats } from '../shared/stats';
import type { Note } from '../shared/notes';
import type { Theme, Language } from '../shared/settings';
import type { GistSyncConfig, GistSyncStatus } from '../shared/gist-sync';

// Unified storage keys - compatible with browser extension
// Extension uses local:leetsrs: prefix for local data and sync:leetsrs: for sync data

export const STORAGE_KEYS = {
  // Local data (synced via Gist)
  cards: 'local:leetsrs:cards',
  stats: 'local:leetsrs:stats',
  notes: 'local:leetsrs:notes',
  dataUpdatedAt: 'local:leetsrs:dataUpdatedAt',
  lastSyncTime: 'local:leetsrs:lastSyncTime',
  lastSyncDirection: 'local:leetsrs:lastSyncDirection',
  
  // Sync data (settings that sync across devices)
  maxNewCardsPerDay: 'sync:leetsrs:maxNewCardsPerDay',
  dayStartHour: 'sync:leetsrs:dayStartHour',
  animationsEnabled: 'sync:leetsrs:animationsEnabled',
  theme: 'sync:leetsrs:theme',
  autoClearLeetcode: 'sync:leetsrs:autoClearLeetcode',
  badgeEnabled: 'sync:leetsrs:badgeEnabled',
  language: 'sync:leetsrs:language',
  githubPat: 'sync:leetsrs:githubPat',
  gistId: 'sync:leetsrs:gistId',
  gistSyncEnabled: 'sync:leetsrs:gistSyncEnabled',
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