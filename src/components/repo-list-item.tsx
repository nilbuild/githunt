import { formatDistanceToNowStrict } from 'date-fns';
import { Star } from 'lucide-react';
import type { Repository } from '../lib/github';
import { formatCompact, formatFull } from '../lib/format';
import { Avatar } from './avatar';
import { RepoDescription } from './repo-description';
import { RepoStats } from './repo-stats';

type RepoListItemProps = {
  repository: Repository;
  rank: number;
};

export function RepoListItem(props: RepoListItemProps) {
  const repository = props.repository;

  return (
    <article className="flex gap-4 px-4 py-4 transition-colors hover:bg-surface-2 sm:px-5">
      <span className="hidden w-5 shrink-0 pt-2.5 text-right font-mono text-xs text-subtle tabular-nums sm:block">
        {props.rank}
      </span>
      <a href={repository.owner.url} target="_blank" rel="noreferrer" className="shrink-0 pt-0.5">
        <Avatar src={repository.owner.avatarUrl} alt={repository.owner.login} className="size-9" />
      </a>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] leading-6">
          <a href={repository.url} target="_blank" rel="noreferrer" className="hover:underline">
            <span className="text-muted">{repository.owner.login} / </span>
            <span className="font-semibold">{repository.name}</span>
          </a>
        </h3>
        <RepoDescription description={repository.description} className="mt-0.5 line-clamp-2" />
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <RepoStats repository={repository} />
          <span className="text-xs text-subtle" title={new Date(repository.createdAt).toLocaleString()}>
            Created {formatDistanceToNowStrict(new Date(repository.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      <a
        href={`${repository.url}/stargazers`}
        target="_blank"
        rel="noreferrer"
        title={`${formatFull(repository.stars)} stars`}
        className="flex h-7 shrink-0 items-center gap-1.5 self-start rounded-full border border-line bg-surface-2 px-2.5 text-xs font-medium tabular-nums transition-colors hover:border-line-strong"
      >
        <Star className="size-3.5 fill-star text-star" />
        {formatCompact(repository.stars)}
      </a>
    </article>
  );
}
