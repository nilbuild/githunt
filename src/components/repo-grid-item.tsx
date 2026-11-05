import type { Repository } from '../lib/github';
import { Avatar } from './avatar';
import { RepoDescription } from './repo-description';
import { RepoStats, StarCount } from './repo-stats';

type RepoGridItemProps = {
  repository: Repository;
  rank: number;
};

export function RepoGridItem(props: RepoGridItemProps) {
  const repository = props.repository;

  return (
    <article className="card flex flex-col p-4 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between gap-3">
        <a
          href={repository.owner.url}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 items-center gap-2 text-sm text-muted hover:text-fg"
        >
          <Avatar src={repository.owner.avatarUrl} alt="" className="size-6" />
          <span className="truncate">{repository.owner.login}</span>
        </a>
        <span className="font-mono text-xs text-subtle tabular-nums">#{props.rank}</span>
      </div>

      <h3 className="mt-3 truncate font-semibold">
        <a href={repository.url} target="_blank" rel="noreferrer" className="hover:underline">
          {repository.name}
        </a>
      </h3>
      <RepoDescription description={repository.description} className="mt-1 line-clamp-3 flex-1" />

      <div className="mt-4 flex items-center justify-between gap-3">
        <RepoStats repository={repository} />
        <StarCount repository={repository} className="text-xs" />
      </div>
    </article>
  );
}
