import { useState } from 'react';
import { useMoreRepositories } from '../hooks/use-more-repositories';
import type { ViewType } from '../hooks/use-preferences';
import { MAX_SEARCH_RESULTS, PAGE_SIZE, type TrendingPage } from '../lib/github';
import type { Period } from '../lib/period';
import { ErrorNotice } from './notices';
import { PeriodHeader } from './period-header';
import { RepoGridItem } from './repo-grid-item';
import { RepoListItem } from './repo-list-item';
import { ShowMoreBar } from './show-more-bar';

type RepoGroupProps = {
  page: TrendingPage;
  index: number;
  period: Period;
  view: ViewType;
  languages: string[];
  token: string;
  onOpenSettings: () => void;
};

export function RepoGroup(props: RepoGroupProps) {
  const [extraPages, setExtraPages] = useState(0);
  const more = useMoreRepositories({
    page: props.page,
    languages: props.languages,
    token: props.token,
    extraPages,
  });

  const range = { start: new Date(props.page.start), end: new Date(props.page.end) };
  const available = Math.min(props.page.totalCount, MAX_SEARCH_RESULTS);
  const hasMore = more.lastPageSize === PAGE_SIZE && more.repositories.length < available && !more.error;
  const repositories = more.repositories;

  const showMoreBar = hasMore ? (
    <ShowMoreBar
      shown={repositories.length}
      available={available}
      isLoading={more.isLoading}
      onShowMore={() => setExtraPages((count) => count + 1)}
    />
  ) : null;

  return (
    <section>
      <PeriodHeader period={props.period} index={props.index} range={range} totalCount={props.page.totalCount} />

      {repositories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong px-6 py-10 text-center text-sm text-muted">
          No repositories were created in this period.
        </div>
      ) : null}

      {repositories.length > 0 && props.view === 'grid' ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {repositories.map((repository, index) => (
              <RepoGridItem key={repository.id} repository={repository} rank={index + 1} />
            ))}
          </div>
          {showMoreBar ? <div className="card mt-3 rounded-xl">{showMoreBar}</div> : null}
        </>
      ) : null}

      {repositories.length > 0 && props.view === 'list' ? (
        <div className="card divide-y divide-line overflow-hidden">
          {repositories.map((repository, index) => (
            <RepoListItem key={repository.id} repository={repository} rank={index + 1} />
          ))}
          {showMoreBar ? <div className="bg-surface-2">{showMoreBar}</div> : null}
        </div>
      ) : null}

      {more.error && !more.isLoading ? (
        <div className="mt-3">
          <ErrorNotice
            error={more.error}
            hasToken={Boolean(props.token)}
            onRetry={more.retry}
            onOpenSettings={props.onOpenSettings}
          />
        </div>
      ) : null}
    </section>
  );
}
