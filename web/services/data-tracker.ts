import { storage } from './storage';
import { STORAGE_KEYS } from './storage-keys';

// Helper to mark that data has been modified (for sync purposes)
export async function markDataUpdated(): Promise<void> {
  await storage.setItem(STORAGE_KEYS.dataUpdatedAt, new Date().toISOString());
}

export async function getDataUpdatedAt(): Promise<string | null> {
  return (await storage.getItem<string>(STORAGE_KEYS.dataUpdatedAt)) ?? null;
}
