import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Grade, State as FsrsState } from 'ts-fsrs';
import type { Difficulty, Card, LeetcodeDomain } from '../shared/cards';
import type { Theme, Language } from '../shared/settings';
import type { GistSyncConfig } from '../shared/gist-sync';
import * as cards from '../services/cards';
import * as notes from '../services/notes';
import * as stats from '../services/stats';
import * as settings from '../services/settings';
import * as gistSync from '../services/gistSync';

// Query Keys
export const queryKeys = {
  cards: {
    all: ['cards'] as const,
    reviewQueue: ['cards', 'reviewQueue'] as const,
  },
  notes: {
    all: ['notes'] as const,
    detail: (cardId: string) => ['notes', cardId] as const,
  },
  stats: {
    all: ['stats'] as const,
    today: ['stats', 'today'] as const,
    allTime: ['stats', 'allTime'] as const,
    cardState: ['stats', 'cardState'] as const,
    lastNDays: (days: number) => ['stats', 'lastNDays', days] as const,
    nextNDays: (days: number) => ['stats', 'nextNDays', days] as const,
  },
  settings: {
    all: ['settings'] as const,
    maxNewCardsPerDay: ['settings', 'maxNewCardsPerDay'] as const,
    dayStartHour: ['settings', 'dayStartHour'] as const,
    animationsEnabled: ['settings', 'animationsEnabled'] as const,
    theme: ['settings', 'theme'] as const,
    autoClearLeetcode: ['settings', 'autoClearLeetcode'] as const,
    badgeEnabled: ['settings', 'badgeEnabled'] as const,
    language: ['settings', 'language'] as const,
  },
  gistSync: {
    all: ['gistSync'] as const,
    config: ['gistSync', 'config'] as const,
    status: ['gistSync', 'status'] as const,
  },
} as const;

// Card queries
export function useCardsQuery() {
  return useQuery({
    queryKey: queryKeys.cards.all,
    queryFn: () => cards.getAllCards(),
  });
}

export function useReviewQueueQuery(options?: { enabled?: boolean; refetchOnWindowFocus?: boolean }) {
  const { enabled = true, refetchOnWindowFocus = false } = options || {};
  return useQuery({
    queryKey: queryKeys.cards.reviewQueue,
    queryFn: () => cards.getReviewQueue(),
    enabled,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus,
  });
}

export function useTodayStatsQuery() {
  return useQuery({
    queryKey: queryKeys.stats.today,
    queryFn: () => stats.getTodayStats(),
  });
}

export function useCardStateStatsQuery() {
  return useQuery({
    queryKey: queryKeys.stats.cardState,
    queryFn: () => stats.getCardStateStats(),
  });
}

export function useAllStatsQuery() {
  return useQuery({
    queryKey: queryKeys.stats.allTime,
    queryFn: () => stats.getAllStats(),
  });
}

export function useLastNDaysStatsQuery(days: number) {
  return useQuery({
    queryKey: queryKeys.stats.lastNDays(days),
    queryFn: () => stats.getLastNDaysStats(days),
  });
}

export function useNextNDaysStatsQuery(days: number) {
  return useQuery({
    queryKey: queryKeys.stats.nextNDays(days),
    queryFn: () => stats.getNextNDaysStats(days),
  });
}

export function useNoteQuery(cardId: string) {
  return useQuery({
    queryKey: queryKeys.notes.detail(cardId),
    queryFn: () => notes.getNote(cardId),
    staleTime: 1000 * 60 * 5,
  });
}

// Card mutations
export function useAddCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      name,
      leetcodeId,
      difficulty,
      domain,
    }: {
      slug: string;
      name: string;
      leetcodeId: string;
      difficulty: Difficulty;
      domain: LeetcodeDomain;
    }) => cards.addCard(slug, name, leetcodeId, difficulty, domain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
}

export function useRemoveCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => cards.removeCard(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
}

export function useRateCardMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    { card: Card; shouldRequeue: boolean },
    Error,
    {
      slug: string;
      name: string;
      rating: Grade;
      leetcodeId: string;
      difficulty: Difficulty;
      domain: LeetcodeDomain;
    }
  >({
    mutationFn: ({ slug, name, rating, leetcodeId, difficulty, domain }) =>
      cards.rateCard(slug, name, rating, leetcodeId, difficulty, domain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
}

export function useSaveNoteMutation(cardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => notes.saveNote(cardId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.detail(cardId) });
    },
  });
}

export function useDeleteNoteMutation(cardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notes.deleteNote(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.detail(cardId) });
    },
  });
}

export function useDelayCardMutation() {
  const queryClient = useQueryClient();
  return useMutation<Card, Error, { slug: string; days: number }>({
    mutationFn: ({ slug, days }) => cards.delayCard(slug, days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
    },
  });
}

export function usePauseCardMutation() {
  const queryClient = useQueryClient();
  return useMutation<Card, Error, { slug: string; paused: boolean }>({
    mutationFn: ({ slug, paused }) => cards.setPauseStatus(slug, paused),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
    },
  });
}

// Settings queries
export function useMaxNewCardsPerDayQuery() {
  return useQuery({
    queryKey: queryKeys.settings.maxNewCardsPerDay,
    queryFn: () => settings.getMaxNewCardsPerDay(),
  });
}

export function useSetMaxNewCardsPerDayMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: number) => settings.setMaxNewCardsPerDay(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.maxNewCardsPerDay });
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.reviewQueue });
    },
  });
}

export function useDayStartHourQuery() {
  return useQuery({
    queryKey: queryKeys.settings.dayStartHour,
    queryFn: () => settings.getDayStartHour(),
  });
}

export function useSetDayStartHourMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: number) => settings.setDayStartHour(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.dayStartHour });
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.reviewQueue });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
}

export function useAnimationsEnabledQuery() {
  return useQuery({
    queryKey: queryKeys.settings.animationsEnabled,
    queryFn: () => settings.getAnimationsEnabled(),
  });
}

export function useSetAnimationsEnabledMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: boolean) => settings.setAnimationsEnabled(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.animationsEnabled });
    },
  });
}

export function useThemeQuery() {
  return useQuery({
    queryKey: queryKeys.settings.theme,
    queryFn: () => settings.getTheme(),
  });
}

export function useSetThemeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: Theme) => settings.setTheme(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.theme });
    },
  });
}

export function useAutoClearLeetcodeQuery() {
  return useQuery({
    queryKey: queryKeys.settings.autoClearLeetcode,
    queryFn: () => settings.getAutoClearLeetcode(),
  });
}

export function useSetAutoClearLeetcodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: boolean) => settings.setAutoClearLeetcode(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.autoClearLeetcode });
    },
  });
}

export function useBadgeEnabledQuery() {
  return useQuery({
    queryKey: queryKeys.settings.badgeEnabled,
    queryFn: () => settings.getBadgeEnabled(),
  });
}

export function useSetBadgeEnabledMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: boolean) => settings.setBadgeEnabled(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.badgeEnabled });
    },
  });
}

export function useLanguageQuery() {
  return useQuery({
    queryKey: queryKeys.settings.language,
    queryFn: () => settings.getLanguage(),
  });
}

export function useSetLanguageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: Language) => settings.setLanguage(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.language });
    },
  });
}

// Data import/export
export function useExportDataMutation() {
  return useMutation({
    mutationFn: async () => {
      const data = {
        cards: localStorage.getItem('leetsrs_web_cards'),
        stats: localStorage.getItem('leetsrs_web_stats'),
        notes: localStorage.getItem('leetsrs_web_notes'),
        settings: localStorage.getItem('leetsrs_web_settings'),
      };
      return JSON.stringify(data);
    },
  });
}

export function useImportDataMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jsonData: string) => {
      const data = JSON.parse(jsonData);
      if (data.cards) localStorage.setItem('leetsrs_web_cards', data.cards);
      if (data.stats) localStorage.setItem('leetsrs_web_stats', data.stats);
      if (data.notes) localStorage.setItem('leetsrs_web_notes', data.notes);
      if (data.settings) localStorage.setItem('leetsrs_web_settings', data.settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useResetAllDataMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Preserve PAT before reset (it's not in export for security)
      const existingPat = localStorage.getItem('leetsrs_web_github_pat');
      
      Object.keys(localStorage)
        .filter(key => key.startsWith('leetsrs_web_'))
        .forEach(key => localStorage.removeItem(key));
        
      // Restore PAT if it existed
      if (existingPat) {
        localStorage.setItem('leetsrs_web_github_pat', existingPat);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

// Gist Sync queries and mutations
export function useGistSyncConfigQuery() {
  return useQuery({
    queryKey: queryKeys.gistSync.config,
    queryFn: () => gistSync.getGistSyncConfig(),
  });
}

export function useGistSyncStatusQuery() {
  return useQuery({
    queryKey: queryKeys.gistSync.status,
    queryFn: () => gistSync.getGistSyncStatus(),
    refetchInterval: 15000,
  });
}

export function useSetGistSyncConfigMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (config: Partial<GistSyncConfig>) => gistSync.setGistSyncConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gistSync.config });
    },
  });
}

export function useTriggerGistSyncMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => gistSync.triggerGistSync(),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useCreateNewGistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => gistSync.createNewGist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gistSync.all });
    },
  });
}

export function useValidatePatMutation() {
  return useMutation({
    mutationFn: (pat: string) => gistSync.validatePat(pat),
  });
}

export function useValidateGistIdMutation() {
  return useMutation({
    mutationFn: ({ gistId, pat }: { gistId: string; pat: string }) =>
      gistSync.validateGistId(gistId, pat),
  });
}