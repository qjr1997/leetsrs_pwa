import { STORAGE_KEYS, storage } from './storage';
import { 
  DEFAULT_THEME, 
  DEFAULT_LANGUAGE, 
  DEFAULT_MAX_NEW_CARDS_PER_DAY, 
  DEFAULT_DAY_START_HOUR 
} from '../shared/settings';
import type { Theme, Language } from '../shared/settings';

export async function getMaxNewCardsPerDay(): Promise<number> {
  const value = await storage.getItem<number>(STORAGE_KEYS.maxNewCardsPerDay);
  return value ?? DEFAULT_MAX_NEW_CARDS_PER_DAY;
}

export async function setMaxNewCardsPerDay(value: number): Promise<void> {
  await storage.setItem(STORAGE_KEYS.maxNewCardsPerDay, value);
}

export async function getDayStartHour(): Promise<number> {
  const value = await storage.getItem<number>(STORAGE_KEYS.dayStartHour);
  return value ?? DEFAULT_DAY_START_HOUR;
}

export async function setDayStartHour(value: number): Promise<void> {
  await storage.setItem(STORAGE_KEYS.dayStartHour, value);
}

export async function getAnimationsEnabled(): Promise<boolean> {
  const value = await storage.getItem<boolean>(STORAGE_KEYS.animationsEnabled);
  return value ?? true;
}

export async function setAnimationsEnabled(value: boolean): Promise<void> {
  await storage.setItem(STORAGE_KEYS.animationsEnabled, value);
}

export async function getTheme(): Promise<Theme> {
  const value = await storage.getItem<Theme>(STORAGE_KEYS.theme);
  return value ?? DEFAULT_THEME;
}

export async function setTheme(value: Theme): Promise<void> {
  await storage.setItem(STORAGE_KEYS.theme, value);
}

export async function getAutoClearLeetcode(): Promise<boolean> {
  const value = await storage.getItem<boolean>(STORAGE_KEYS.autoClearLeetcode);
  return value ?? false;
}

export async function setAutoClearLeetcode(value: boolean): Promise<void> {
  await storage.setItem(STORAGE_KEYS.autoClearLeetcode, value);
}

export async function getBadgeEnabled(): Promise<boolean> {
  const value = await storage.getItem<boolean>(STORAGE_KEYS.badgeEnabled);
  return value ?? true;
}

export async function setBadgeEnabled(value: boolean): Promise<void> {
  await storage.setItem(STORAGE_KEYS.badgeEnabled, value);
}

export async function getLanguage(): Promise<Language> {
  const value = await storage.getItem<Language>(STORAGE_KEYS.language);
  return value ?? DEFAULT_LANGUAGE;
}

export async function setLanguage(value: Language): Promise<void> {
  await storage.setItem(STORAGE_KEYS.language, value);
}