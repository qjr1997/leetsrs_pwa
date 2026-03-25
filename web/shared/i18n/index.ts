import type { Language } from '../settings';
import en from './en';
import zhCN from './zh-CN';

// Helper type to widen literal string types to string while preserving structure and functions
type DeepStringify<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T extends object
    ? { [K in keyof T]: DeepStringify<T[K]> }
    : T extends string
      ? string
      : T;

// Type for translations - all languages must match this structure
export type Translations = DeepStringify<typeof en>;

// All translations keyed by language code
export const translations: Record<Language, Translations> = {
  en,
  'zh-CN': zhCN,
};

// Language metadata for the dropdown UI
export const LANGUAGE_OPTIONS: Array<{
  code: Language;
  name: string;
  nativeName: string;
}> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
];

/**
 * Detect the best matching supported language from the browser's language preferences.
 */
export function detectBrowserLanguage(): Language {
  const browserLanguages = typeof navigator !== 'undefined' ? navigator.languages : [];

  for (const browserLang of browserLanguages) {
    // Exact match
    if (browserLang in translations) {
      return browserLang as Language;
    }

    // Base language match
    const baseLang = browserLang.split('-')[0];
    if (baseLang in translations) {
      return baseLang as Language;
    }

    // zh variants → zh-CN
    if (baseLang === 'zh') {
      return 'zh-CN';
    }
  }

  return 'en';
}
