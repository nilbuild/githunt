import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { hydrate, QueryClient } from '@tanstack/react-query';
import { persistQueryClientSubscribe } from '@tanstack/react-query-persist-client';
import { GitHubError } from './github';

const ONE_HOUR = 1000 * 60 * 60;
const CACHE_BUSTER = 'v3';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_HOUR,
      gcTime: ONE_HOUR,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof GitHubError && error.kind !== 'network') {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'githunt:cache',
});

function restoreCache() {
  const persisted = persister.restoreClient();
  if (!persisted || 'then' in persisted) {
    return;
  }

  const isExpired = Date.now() - persisted.timestamp > ONE_HOUR;
  if (isExpired || persisted.buster !== CACHE_BUSTER) {
    persister.removeClient();
    return;
  }

  hydrate(queryClient, persisted.clientState);
}

export function setupQueryCache() {
  try {
    restoreCache();
  } catch {
    persister.removeClient();
  }

  persistQueryClientSubscribe({
    queryClient,
    persister,
    buster: CACHE_BUSTER,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => query.queryKey[0] === 'trending' && query.state.status === 'success',
    },
  });
}
