import { useQueryClient } from '@tanstack/react-query';
import { LayoutGrid, List } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Header } from './components/header';
import { LanguageSelect } from './components/language-select';
import { NextPeriod } from './components/next-period';
import { TokenNotice } from './components/notices';
import { RepoGroup } from './components/repo-group';
import { SegmentedControl } from './components/segmented-control';
import { TokenDialog } from './components/token-dialog';
import { ViewsMenu } from './components/views-menu';
import {
  useHideNoLanguage,
  useLanguages,
  usePeriod,
  useToken,
  useTokenNoticeDismissed,
  useViewType,
  type ViewType,
} from './hooks/use-preferences';
import { useTrending } from './hooks/use-trending';
import { useUrlSync } from './hooks/use-url-sync';
import { PERIODS } from './lib/period';

const VIEW_OPTIONS: { value: ViewType; label: ReactNode; ariaLabel: string }[] = [
  { value: 'list', label: <List className="size-4" />, ariaLabel: 'List view' },
  { value: 'grid', label: <LayoutGrid className="size-4" />, ariaLabel: 'Grid view' },
];

const languageList = new Intl.ListFormat('en', { type: 'disjunction' });

const PERIOD_DESCRIPTIONS = {
  day: 'today',
  week: 'this week',
  month: 'this month',
  year: 'this year',
};

export function App() {
  const queryClient = useQueryClient();
  const [period, setPeriod] = usePeriod();
  const [hideNoLanguage, setHideNoLanguage] = useHideNoLanguage();
  const [languages, setLanguages] = useLanguages();
  const [view, setView] = useViewType();
  const [token] = useToken();
  const [isNoticeDismissed, setNoticeDismissed] = useTokenNoticeDismissed();
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  useUrlSync({ languages, period, view });

  const trending = useTrending({ period, languages, token });
  const pages = trending.data?.pages ?? [];
  const showTokenNotice = !token && !isNoticeDismissed;

  useEffect(() => {
    queryClient.resetQueries({
      queryKey: ['trending'],
      predicate: (query) => query.state.status === 'error',
    });
  }, [token, queryClient]);

  const retry = () => {
    if (trending.isFetchNextPageError) {
      trending.fetchNextPage();
      return;
    }
    trending.refetch();
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-10 pb-16 sm:px-6 sm:pt-12">
        <h1 className="text-2xl font-semibold tracking-tight">Trending repositories</h1>
        <p className="mt-1.5 text-sm text-muted">
          Most starred{' '}
          {languages.length > 0 ? (
            <>
              <span className="font-medium text-fg">{languageList.format(languages)}</span>{' '}
            </>
          ) : null}
          repos created {PERIOD_DESCRIPTIONS[period]}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ViewsMenu
              filters={{ languages, period, view }}
              onApply={(saved) => {
                setLanguages(saved.languages);
                setPeriod(saved.period);
                setView(saved.view);
              }}
            />
            <div className="hidden h-5 w-px bg-line-strong sm:block" />
            <LanguageSelect
              value={languages}
              onChange={setLanguages}
              hideNoLanguage={hideNoLanguage}
              onHideNoLanguageChange={setHideNoLanguage}
            />
            <SegmentedControl label="Time period" value={period} options={PERIODS} onChange={setPeriod} />
          </div>
          <SegmentedControl
            label="Layout"
            value={view}
            options={VIEW_OPTIONS}
            onChange={setView}
            className="max-sm:hidden"
          />
        </div>

        {showTokenNotice ? (
          <div className="mt-6">
            <TokenNotice onAddToken={() => setSettingsOpen(true)} onDismiss={() => setNoticeDismissed(true)} />
          </div>
        ) : null}

        <div className="mt-8 space-y-10">
          {pages.map((page, index) => (
            <RepoGroup
              key={`${languages.join(',')}:${page.start}`}
              page={page}
              index={index}
              period={period}
              view={view}
              languages={languages}
              hideNoLanguage={hideNoLanguage}
              token={token}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          ))}

          <NextPeriod
            key={`${period}:${pages.length}`}
            period={period}
            index={pages.length}
            view={view}
            isLoading={trending.isPending || trending.isFetchingNextPage}
            error={trending.isFetching ? null : trending.error}
            hasToken={Boolean(token)}
            onLoad={() => trending.fetchNextPage()}
            onRetry={retry}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-subtle sm:flex-row sm:justify-between sm:px-6">
          <p>Data from the GitHub search API.</p>
          <p>
            Built by{' '}
            <a href="https://github.com/kamranahmedse" target="_blank" rel="noreferrer" className="text-fg hover:underline">
              Kamran Ahmed
            </a>
          </p>
        </div>
      </footer>

      <TokenDialog open={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
