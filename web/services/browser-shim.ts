// Shim for wxt/browser module to work in PWA environment

// Mock browser.runtime.sendMessage to use local services
import * as cards from '../services/cards';
import * as notes from '../services/notes';
import * as stats from '../services/stats';
import * as settings from '../services/settings';
import * as gistSync from '../services/gistSync';
import { MessageType } from '../../shared/messages';

const messageHandlers: Record<string, Function> = {
  [MessageType.ADD_CARD]: cards.addCard,
  [MessageType.GET_ALL_CARDS]: cards.getAllCards,
  [MessageType.REMOVE_CARD]: cards.removeCard,
  [MessageType.DELAY_CARD]: cards.delayCard,
  [MessageType.SET_PAUSE_STATUS]: cards.setPauseStatus,
  [MessageType.RATE_CARD]: cards.rateCard,
  [MessageType.GET_REVIEW_QUEUE]: cards.getReviewQueue,
  [MessageType.GET_TODAY_STATS]: stats.getTodayStats,
  [MessageType.GET_NOTE]: notes.getNote,
  [MessageType.SAVE_NOTE]: notes.saveNote,
  [MessageType.DELETE_NOTE]: notes.deleteNote,
  [MessageType.GET_MAX_NEW_CARDS_PER_DAY]: settings.getMaxNewCardsPerDay,
  [MessageType.SET_MAX_NEW_CARDS_PER_DAY]: settings.setMaxNewCardsPerDay,
  [MessageType.GET_DAY_START_HOUR]: settings.getDayStartHour,
  [MessageType.SET_DAY_START_HOUR]: settings.setDayStartHour,
  [MessageType.GET_ANIMATIONS_ENABLED]: settings.getAnimationsEnabled,
  [MessageType.SET_ANIMATIONS_ENABLED]: settings.setAnimationsEnabled,
  [MessageType.GET_THEME]: settings.getTheme,
  [MessageType.SET_THEME]: settings.setTheme,
  [MessageType.GET_AUTO_CLEAR_LEETCODE]: settings.getAutoClearLeetcode,
  [MessageType.SET_AUTO_CLEAR_LEETCODE]: settings.setAutoClearLeetcode,
  [MessageType.GET_BADGE_ENABLED]: settings.getBadgeEnabled,
  [MessageType.SET_BADGE_ENABLED]: settings.setBadgeEnabled,
  [MessageType.GET_LANGUAGE]: settings.getLanguage,
  [MessageType.SET_LANGUAGE]: settings.setLanguage,
  [MessageType.GET_CARD_STATE_STATS]: stats.getCardStateStats,
  [MessageType.GET_ALL_STATS]: stats.getAllStats,
  [MessageType.GET_LAST_N_DAYS_STATS]: stats.getLastNDaysStats,
  [MessageType.GET_NEXT_N_DAYS_STATS]: stats.getNextNDaysStats,
  [MessageType.GET_GIST_SYNC_CONFIG]: gistSync.getGistSyncConfig,
  [MessageType.SET_GIST_SYNC_CONFIG]: gistSync.setGistSyncConfig,
  [MessageType.GET_GIST_SYNC_STATUS]: gistSync.getGistSyncStatus,
  [MessageType.TRIGGER_GIST_SYNC]: gistSync.triggerGistSync,
  [MessageType.CREATE_NEW_GIST]: gistSync.createNewGist,
  [MessageType.VALIDATE_PAT]: gistSync.validatePat,
  [MessageType.VALIDATE_GIST_ID]: gistSync.validateGistId,
};

export const browser = {
  runtime: {
    sendMessage: async (message: any) => {
      const handler = messageHandlers[message.type];
      if (!handler) {
        throw new Error(`Unknown message type: ${message.type}`);
      }
      
      // Remove type from message and pass rest as arguments
      const { type, ...params } = message;
      return handler(Object.values(params).length === 1 ? Object.values(params)[0] : params);
    },
    onMessage: {
      addListener: () => {},
      removeListener: () => {},
    },
  },
  storage: {
    local: {
      get: async (keys: string | string[] | null) => {
        if (!keys) {
          const allData: Record<string, any> = {};
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
              allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
            }
          }
          return allData;
        }
        if (typeof keys === 'string') {
          return { [keys]: JSON.parse(localStorage.getItem(keys) || 'null') };
        }
        const result: Record<string, any> = {};
        keys.forEach(key => {
          result[key] = JSON.parse(localStorage.getItem(key) || 'null');
        });
        return result;
      },
      set: async (items: Record<string, any>) => {
        Object.entries(items).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
      },
      remove: async (keys: string | string[]) => {
        if (typeof keys === 'string') {
          localStorage.removeItem(keys);
        } else {
          keys.forEach(key => localStorage.removeItem(key));
        }
      },
    },
    sync: {
      get: async (keys: string | string[] | null) => browser.storage.local.get(keys),
      set: async (items: Record<string, any>) => browser.storage.local.set(items),
      remove: async (keys: string | string[]) => browser.storage.local.remove(keys),
    },
  },
  action: {
    setBadgeText: async () => {},
    setBadgeBackgroundColor: async () => {},
  },
  alarms: {
    create: async () => {},
    clear: async () => {},
    onAlarm: {
      addListener: () => {},
      removeListener: () => {},
    },
  },
  i18n: {
    getMessage: (key: string) => key,
  },
};