import type { Period } from '../lib/period';
import { useLocalStorage } from './use-local-storage';

export type ViewType = 'list' | 'grid';

export const STORAGE_KEYS = {
  period: 'githunt:period',
  legacyLanguage: 'githunt:language',
  languages: 'githunt:languages',
  view: 'githunt:view',
  token: 'githunt:token',
  theme: 'githunt:theme',
  tokenNoticeDismissed: 'githunt:token-notice-dismissed',
} as const;

export function usePeriod() {
  return useLocalStorage<Period>(STORAGE_KEYS.period, 'week');
}

const NO_LANGUAGES: string[] = [];

export function useLanguages() {
  return useLocalStorage<string[]>(STORAGE_KEYS.languages, NO_LANGUAGES);
}

export function useViewType() {
  return useLocalStorage<ViewType>(STORAGE_KEYS.view, 'list');
}

export function useToken() {
  return useLocalStorage<string>(STORAGE_KEYS.token, '');
}

export function useTokenNoticeDismissed() {
  return useLocalStorage<boolean>(STORAGE_KEYS.tokenNoticeDismissed, false);
}
