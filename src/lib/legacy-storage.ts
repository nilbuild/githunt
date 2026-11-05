import { STORAGE_KEYS } from '../hooks/use-preferences';
import { writeStorage } from '../hooks/use-local-storage';

const LEGACY_KEY = 'persist:githunt:root';

type LegacyPreference = {
  viewType?: string;
  dateJump?: string;
  language?: string;
  options?: { token?: string };
};

function migrateSingleLanguage() {
  const raw = localStorage.getItem(STORAGE_KEYS.legacyLanguage);
  if (raw === null) {
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.legacyLanguage);
  const language: unknown = JSON.parse(raw);
  if (typeof language === 'string' && language) {
    writeStorage(STORAGE_KEYS.languages, [language]);
  }
}

export function migrateLegacyStorage() {
  try {
    migrateSingleLanguage();
  } catch {
    localStorage.removeItem(STORAGE_KEYS.legacyLanguage);
  }

  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) {
      return;
    }

    localStorage.removeItem(LEGACY_KEY);
    const root = JSON.parse(raw);
    const preference: LegacyPreference = JSON.parse(root.preference ?? '{}');

    if (preference.options?.token) {
      writeStorage(STORAGE_KEYS.token, preference.options.token);
    }
    if (preference.language) {
      writeStorage(STORAGE_KEYS.languages, [preference.language]);
    }
    if (preference.viewType === 'grid' || preference.viewType === 'list') {
      writeStorage(STORAGE_KEYS.view, preference.viewType);
    }
    if (preference.dateJump && ['day', 'week', 'month', 'year'].includes(preference.dateJump)) {
      writeStorage(STORAGE_KEYS.period, preference.dateJump);
    }
  } catch {
    return;
  }
}
