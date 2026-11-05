import type { SavedView, ViewType } from '../hooks/use-preferences';
import { PERIODS, type Period } from './period';

export const MAX_SAVED_VIEWS = 20;

export type Filters = {
  languages: string[];
  period: Period;
  view: ViewType;
};

function periodLabel(period: Period) {
  return PERIODS.find((item) => item.value === period)?.label ?? period;
}

export function describeFilters(filters: Filters) {
  const languages = filters.languages.length > 0 ? filters.languages.join(', ') : 'All languages';
  const parts = [languages, periodLabel(filters.period)];

  if (filters.view === 'grid') {
    parts.push('Grid');
  }

  return parts.join(' · ');
}

export function suggestName(filters: Filters) {
  const shown = filters.languages.slice(0, 2).join(', ');
  const extra = filters.languages.length > 2 ? ` +${filters.languages.length - 2}` : '';
  const languages = filters.languages.length > 0 ? `${shown}${extra}` : 'All languages';

  return `${languages} · ${periodLabel(filters.period)}`;
}

export function matchesFilters(view: SavedView, filters: Filters) {
  if (view.period !== filters.period || view.view !== filters.view) {
    return false;
  }

  if (view.languages.length !== filters.languages.length) {
    return false;
  }

  const languages = new Set(filters.languages);
  return view.languages.every((language) => languages.has(language));
}
