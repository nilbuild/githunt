import { useEffect, useRef } from 'react';
import type { Period } from '../lib/period';
import { applyUrlStateToStorage, buildSearch } from '../lib/url-state';
import type { ViewType } from './use-preferences';

type UseUrlSyncOptions = {
  languages: string[];
  period: Period;
  view: ViewType;
};

export function useUrlSync(options: UseUrlSyncOptions) {
  const isFirstSync = useRef(true);
  const search = buildSearch(options);

  useEffect(() => {
    if (search === window.location.search) {
      isFirstSync.current = false;
      return;
    }

    const url = `${window.location.pathname}${search}${window.location.hash}`;
    if (isFirstSync.current) {
      window.history.replaceState(null, '', url);
      isFirstSync.current = false;
      return;
    }

    window.history.pushState(null, '', url);
  }, [search]);

  useEffect(() => {
    const onPopState = () => applyUrlStateToStorage(true);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
}
