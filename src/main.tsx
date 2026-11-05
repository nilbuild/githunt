import geistMonoUrl from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url';
import geistUrl from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { migrateLegacyStorage } from './lib/legacy-storage';
import { queryClient, setupQueryCache } from './lib/query-client';
import { applyUrlStateToStorage } from './lib/url-state';
import './index.css';

[geistUrl, geistMonoUrl].forEach((href) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  link.href = href;
  document.head.appendChild(link);
});

migrateLegacyStorage();
applyUrlStateToStorage();
setupQueryCache();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
