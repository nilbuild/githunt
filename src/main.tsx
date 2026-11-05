import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { GitHubError } from './lib/github';
import { migrateLegacyStorage } from './lib/legacy-storage';
import { applyUrlStateToStorage } from './lib/url-state';
import './index.css';

const ONE_HOUR = 1000 * 60 * 60;

migrateLegacyStorage();
applyUrlStateToStorage();

const queryClient = new QueryClient({
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{
        persister,
        maxAge: ONE_HOUR,
        buster: 'v3',
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.queryKey[0] === 'trending' && query.state.status === 'success',
        },
      }}>
      <App />
    </PersistQueryClientProvider>
  </StrictMode>,
);
