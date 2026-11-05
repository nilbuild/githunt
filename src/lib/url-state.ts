import { STORAGE_KEYS, type ViewType } from '../hooks/use-preferences';
import { writeStorage } from '../hooks/use-local-storage';
import { ALL_LANGUAGES } from './languages';
import { PERIODS, type Period } from './period';

export const MAX_LANGUAGES = 5;

const DEFAULT_PERIOD: Period = 'week';
const DEFAULT_VIEW: ViewType = 'list';

type UrlState = {
  languages?: string[];
  period?: Period;
  view?: ViewType;
};

const canonicalLanguages = new Map(ALL_LANGUAGES.map((language) => [language.toLowerCase(), language]));

function parseLanguages(raw: string | null) {
  if (raw === null) {
    return undefined;
  }

  const languages = raw
    .split(',')
    .map((language) => canonicalLanguages.get(language.trim().toLowerCase()))
    .filter((language): language is string => Boolean(language));

  return [...new Set(languages)].slice(0, MAX_LANGUAGES);
}

function parsePeriod(raw: string | null) {
  return PERIODS.find((period) => period.value === raw)?.value;
}

function parseView(raw: string | null): ViewType | undefined {
  if (raw === 'list' || raw === 'grid') {
    return raw;
  }
  return undefined;
}

export function readUrlState(): UrlState {
  const params = new URLSearchParams(window.location.search);

  return {
    languages: parseLanguages(params.get('lang')),
    period: parsePeriod(params.get('period')),
    view: parseView(params.get('view')),
  };
}

export function applyUrlStateToStorage(isNavigation = false) {
  const hasParams = window.location.search.length > 1;
  if (!hasParams && !isNavigation) {
    return;
  }

  const state = readUrlState();
  writeStorage(STORAGE_KEYS.languages, state.languages ?? []);
  writeStorage(STORAGE_KEYS.period, state.period ?? DEFAULT_PERIOD);
  writeStorage(STORAGE_KEYS.view, state.view ?? DEFAULT_VIEW);
}

type FilterState = {
  languages: string[];
  period: Period;
  view: ViewType;
};

export function buildSearch(state: FilterState) {
  const params = new URLSearchParams();

  if (state.languages.length > 0) {
    params.set('lang', state.languages.join(','));
  }
  if (state.period !== DEFAULT_PERIOD) {
    params.set('period', state.period);
  }
  if (state.view !== DEFAULT_VIEW) {
    params.set('view', state.view);
  }

  const search = params.toString().replace(/%2C/g, ',');
  return search ? `?${search}` : '';
}
