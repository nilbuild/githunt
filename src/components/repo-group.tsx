import { ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useMoreRepositories } from '../hooks/use-more-repositories';
import type { ViewType } from '../hooks/use-preferences';
import { MAX_SEARCH_RESULTS, PAGE_SIZE, type Repository, type TrendingPage } from '../lib/github';
import { formatRange, getRangeTitle, type Period } from '../lib/period';
import { formatFull } from '../lib/format';
import { Button } from './button';
import { ErrorNotice } from './notices';
import { RepoGridItem } from './repo-grid-item';
import { RepoListItem } from './repo-list-item';

type RepoGroupProps = {
  page: TrendingPage;
  index: number;
  period: Period;
  view: ViewType;
  languages: string[];
  token: string;
  onOpenSettings: () => void;
};

type GroupBodyProps = {
  repositories: Repository[];
  view: ViewType;
};

function GroupBody(props: GroupBodyProps) {
  if (props.repositories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line-strong px-6 py-10 text-center text-sm text-muted">
        No repositories were created in this period.
      </div>
    );
  }

  if (props.view === 'grid') {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {props.repositories.map((repository, index) => (
          <RepoGridItem key={repository.id} repository={repository} rank={index + 1} />
        ))}
      </div>
    );
  }

  return (
    <div className="card divide-y divide-line overflow-hidden">
      {props.repositories.map((repository, index) => (
        <RepoListItem key={repository.id} repository={repository} rank={index + 1} />
      ))}
    </div>
  );
}

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
  const hasMore = more.lastPageSize === PAGE_SIZE && more.repositories.length < available;

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="flex flex-wrap items-baseline gap-x-2.5">
          <span className="text-lg font-semibold tracking-tight">{getRangeTitle(props.period, props.index, range)}</span>
          <span className="text-sm text-muted">{formatRange(range)}</span>
        </h2>
        {props.page.totalCount > 0 ? (
          <span className="shrink-0 text-xs text-subtle tabular-nums">{formatFull(props.page.totalCount)} repos</span>
        ) : null}
      </div>

      <GroupBody repositories={more.repositories} view={props.view} />

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

      {hasMore && !more.error ? (
        <div className="mt-3 flex items-center justify-center gap-3">
          <Button size="sm" variant="ghost" onClick={() => setExtraPages((count) => count + 1)} disabled={more.isLoading}>
            {more.isLoading ? <Loader2 className="size-4 animate-spin" /> : <ChevronDown className="size-4" />}
            Show more
          </Button>
          <span className="text-xs text-subtle tabular-nums">
            {formatFull(more.repositories.length)} of {formatFull(available)}
          </span>
        </div>
      ) : null}
    </section>
  );
}
