// Storage keys - unified with extension version format
// Using 'local:leetsrs:' prefix for data, 'sync:leetsrs:' for sync settings
export const STORAGE_KEYS = {
  // Data keys (local:leetsrs: prefix)
  cards: 'local:leetsrs:cards',
  stats: 'local:leetsrs:stats',
  notes: 'local:leetsrs:notes',
  
  // Settings keys (sync:leetsrs: prefix for cross-device sync)
  maxNewCardsPerDay: 'sync:leetsrs:maxNewCardsPerDay',
  dayStartHour: 'sync:leetsrs:dayStartHour',
  animationsEnabled: 'sync:leetsrs:animationsEnabled',
  theme: 'sync:leetsrs:theme',
  autoClearLeetcode: 'sync:leetsrs:autoClearLeetcode',
  badgeEnabled: 'sync:leetsrs:badgeEnabled',
  language: 'sync:leetsrs:language',
  
  // Gist sync keys (sync:leetsrs: prefix)
  githubPat: 'sync:leetsrs:githubPat',
  gistId: 'sync:leetsrs:gistId',
  gistSyncEnabled: 'sync:leetsrs:gistSyncEnabled',
  lastSyncTime: 'local:leetsrs:lastSyncTime',
  lastSyncDirection: 'local:leetsrs:lastSyncDirection',
  dataUpdatedAt: 'local:leetsrs:dataUpdatedAt',
} as const;

export function getNoteStorageKey(cardId: string): `local:leetsrs:notes:${string}` {
  return `${STORAGE_KEYS.notes}:${cardId}`;
}
