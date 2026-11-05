import type { ViewType } from '../hooks/use-preferences';
import type { TrendingPage } from '../lib/github';
import { formatRange, getRangeTitle, type Period } from '../lib/period';
import { formatFull } from '../lib/format';
import { RepoGridItem } from './repo-grid-item';
import { RepoListItem } from './repo-list-item';

type RepoGroupProps = {
  page: TrendingPage;
  index: number;
  period: Period;
  view: ViewType;
};

function GroupBody(props: RepoGroupProps) {
  const repositories = props.page.repositories;

  if (repositories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line-strong px-6 py-10 text-center text-sm text-muted">
        No repositories were created in this period.
      </div>
    );
  }

  if (props.view === 'grid') {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repository, index) => (
          <RepoGridItem key={repository.id} repository={repository} rank={index + 1} />
        ))}
      </div>
    );
  }

  return (
    <div className="card divide-y divide-line overflow-hidden">
      {repositories.map((repository, index) => (
        <RepoListItem key={repository.id} repository={repository} rank={index + 1} />
      ))}
    </div>
  );
}

export function RepoGroup(props: RepoGroupProps) {
  const range = { start: new Date(props.page.start), end: new Date(props.page.end) };

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
      <GroupBody {...props} />
    </section>
  );
}
