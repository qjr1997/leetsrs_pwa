import { storage } from './storage';
import { STORAGE_KEYS } from './storage-keys';
import type { Card } from '../shared/cards';
import type { Note } from '../shared/notes';
import type { Theme, Language } from '../shared/settings';
import type { DailyStats } from '../shared/stats';

const SCHEMA_VERSION = 1;
const GIST_FILENAME = 'leetsrs-backup.json';

export interface ExportData {
  schemaVersion: number;
  exportDate: string;
  dataUpdatedAt?: string;
  data: {
    cards: Record<string, Card>;
    stats: Record<string, DailyStats>;
    notes: Record<string, Note>;
    settings: {
      maxNewCardsPerDay?: number;
      dayStartHour?: number;
      animationsEnabled?: boolean;
      theme?: Theme;
      autoClearLeetcode?: boolean;
      badgeEnabled?: boolean;
      language?: Language;
    };
    gistSync?: {
      gistId?: string;
      enabled?: boolean;
    };
  };
}

export async function exportData(): Promise<string> {
  // Gather all data from storage (using extension-compatible keys)
  const cards = (await storage.getItem<Record<string, Card>>(STORAGE_KEYS.cards)) ?? {};
  const stats = (await storage.getItem<Record<string, DailyStats>>(STORAGE_KEYS.stats)) ?? {};
  
  // Get all notes - 兼容插件版本的存储格式（每个 note 单独存储）
  const notes: Record<string, Note> = {};
  for (const card of Object.values(cards)) {
    const noteKey = `${STORAGE_KEYS.notes}:${card.id}`;
    const note = await storage.getItem<Note>(noteKey);
    if (note) {
      notes[card.id] = note;
    }
  }
  
  // Get settings
  const maxNewCardsPerDay = await storage.getItem<number>(STORAGE_KEYS.maxNewCardsPerDay);
  const dayStartHour = await storage.getItem<number>(STORAGE_KEYS.dayStartHour);
  const animationsEnabled = await storage.getItem<boolean>(STORAGE_KEYS.animationsEnabled);
  const theme = await storage.getItem<Theme>(STORAGE_KEYS.theme);
  const autoClearLeetcode = await storage.getItem<boolean>(STORAGE_KEYS.autoClearLeetcode);
  const badgeEnabled = await storage.getItem<boolean>(STORAGE_KEYS.badgeEnabled);
  const language = await storage.getItem<Language>(STORAGE_KEYS.language);
  
  // Get gist sync settings
  const gistId = await storage.getItem<string>(STORAGE_KEYS.gistId);
  const gistSyncEnabled = await storage.getItem<boolean>(STORAGE_KEYS.gistSyncEnabled);
  
  // Get dataUpdatedAt for sync purposes
  const dataUpdatedAt = await storage.getItem<string>(STORAGE_KEYS.dataUpdatedAt);
  
  const exportData: ExportData = {
    schemaVersion: SCHEMA_VERSION,
    exportDate: new Date().toISOString(),
    dataUpdatedAt: dataUpdatedAt ?? undefined,
    data: {
      cards,
      stats,
      notes,
      settings: {
        ...(maxNewCardsPerDay != null && { maxNewCardsPerDay }),
        ...(dayStartHour != null && { dayStartHour }),
        ...(animationsEnabled != null && { animationsEnabled }),
        ...(theme != null && { theme }),
        ...(autoClearLeetcode != null && { autoClearLeetcode }),
        ...(badgeEnabled != null && { badgeEnabled }),
        ...(language != null && { language }),
      },
      gistSync: {
        ...(gistId != null && { gistId }),
        ...(gistSyncEnabled != null && { enabled: gistSyncEnabled }),
      },
    },
  };
  
  return JSON.stringify(exportData, null, 2);
}

export async function importData(jsonData: string): Promise<void> {
  // Parse and validate JSON
  let data: ExportData;
  try {
    data = JSON.parse(jsonData);
  } catch {
    throw new Error('Invalid JSON format');
  }
  
  // Validate structure
  if (!data.exportDate || !data.data) {
    throw new Error('Invalid export data structure');
  }
  
  // Handle plugin format compatibility - plugin may use 'cardMap' instead of 'cards'
  const cardsData = data.data.cards || (data.data as any).cardMap;
  const statsData = data.data.stats || (data.data as any).dailyStats;
  const notesData = data.data.notes || (data.data as any).noteMap || {};
  
  // Validate data types
  if (typeof cardsData !== 'object' || cardsData === null) {
    throw new Error('Invalid cards data');
  }
  
  if (typeof statsData !== 'object' || statsData === null) {
    throw new Error('Invalid stats data');
  }
  
  if (typeof notesData !== 'object' || notesData === null) {
    throw new Error('Invalid notes data');
  }
  
  // Preserve PAT before reset (it's not in export for security)
  const existingPat = await storage.getItem<string>(STORAGE_KEYS.githubPat);
  
  // Clear existing data for a clean import
  await resetAllData();
  
  // Restore PAT if it existed
  if (existingPat) {
    await storage.setItem(STORAGE_KEYS.githubPat, existingPat);
  }
  
  // Import cards (handle both 'cards' and 'cardMap' from plugin)
  await storage.setItem(STORAGE_KEYS.cards, cardsData);
  
  // Import stats (handle both 'stats' and 'dailyStats' from plugin)
  if (statsData && Object.keys(statsData).length > 0) {
    await storage.setItem(STORAGE_KEYS.stats, statsData);
  }
  
  // Import notes - 兼容插件版本的存储格式（每个 note 单独存储）
  for (const [cardId, note] of Object.entries(notesData)) {
    const key = `${STORAGE_KEYS.notes}:${cardId}`;
    await storage.setItem(key, note);
  }
  
  // Import settings
  if (data.data.settings) {
    if (data.data.settings.maxNewCardsPerDay != null) {
      await storage.setItem(STORAGE_KEYS.maxNewCardsPerDay, data.data.settings.maxNewCardsPerDay);
    }
    if (data.data.settings.dayStartHour != null) {
      await storage.setItem(STORAGE_KEYS.dayStartHour, data.data.settings.dayStartHour);
    }
    if (data.data.settings.animationsEnabled != null) {
      await storage.setItem(STORAGE_KEYS.animationsEnabled, data.data.settings.animationsEnabled);
    }
    if (data.data.settings.theme != null) {
      await storage.setItem(STORAGE_KEYS.theme, data.data.settings.theme);
    }
    if (data.data.settings.autoClearLeetcode != null) {
      await storage.setItem(STORAGE_KEYS.autoClearLeetcode, data.data.settings.autoClearLeetcode);
    }
    if (data.data.settings.badgeEnabled != null) {
      await storage.setItem(STORAGE_KEYS.badgeEnabled, data.data.settings.badgeEnabled);
    }
    if (data.data.settings.language != null) {
      await storage.setItem(STORAGE_KEYS.language, data.data.settings.language);
    }
  }
  
  // Import gist sync settings
  if (data.data.gistSync) {
    if (data.data.gistSync.gistId != null) {
      await storage.setItem(STORAGE_KEYS.gistId, data.data.gistSync.gistId);
    }
    if (data.data.gistSync.enabled != null) {
      await storage.setItem(STORAGE_KEYS.gistSyncEnabled, data.data.gistSync.enabled);
    }
  }
  
  // Import dataUpdatedAt from remote to ensure sync consistency
  // This prevents the local device from thinking its data is newer
  if (data.dataUpdatedAt) {
    await storage.setItem(STORAGE_KEYS.dataUpdatedAt, data.dataUpdatedAt);
  } else {
    // Fallback for legacy exports without dataUpdatedAt
    await storage.setItem(STORAGE_KEYS.dataUpdatedAt, new Date().toISOString());
  }
}

export async function resetAllData(): Promise<void> {
  // Remove all data except PAT
  const existingPat = await storage.getItem<string>(STORAGE_KEYS.githubPat);
  
  // Clear all leetsrs-related keys (both old web prefix and new unified prefix)
  Object.keys(localStorage)
    .filter(key => key.startsWith('leetsrs_web_') || key.startsWith('local:leetsrs:') || key.startsWith('sync:leetsrs:'))
    .forEach(key => localStorage.removeItem(key));
    
  // Restore PAT
  if (existingPat) {
    await storage.setItem(STORAGE_KEYS.githubPat, existingPat);
  }
}

export { GIST_FILENAME };