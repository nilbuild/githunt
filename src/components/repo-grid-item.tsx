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
    <article className="card flex min-h-[255px]flex-col p-5 transition-colors hover:border-line-strong">
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

      <h3 className="mt-4 truncate font-semibold">
        <a href={repository.url} target="_blank" rel="noreferrer" className="hover:underline">
          {repository.name}
        </a>
      </h3>
      <RepoDescription description={repository.description} className="mt-1.5 line-clamp-3" />

      <div className="mt-auto flex items-center pt-5 justify-between gap-3">
        <RepoStats repository={repository} />
        <StarCount repository={repository} className="text-xs" />
      </div>
    </article>
  );
}
