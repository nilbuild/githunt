import { CircleDot, GitFork, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Repository } from '../lib/github';
import { formatCompact, formatFull } from '../lib/format';
import { getLanguageColor } from '../lib/languages';
import { cn } from '../lib/cn';

type StatLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
  className?: string;
};

export function StatLink(props: StatLinkProps) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      title={props.label}
      className={cn('inline-flex items-center gap-1 tabular-nums transition hover:text-fg', props.className)}
    >
      {props.children}
    </a>
  );
}

export function LanguageBadge(props: { language: string | null }) {
  if (!props.language) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ backgroundColor: getLanguageColor(props.language) }} />
      {props.language}
    </span>
  );
}

export function StarCount(props: { repository: Repository; className?: string }) {
  return (
    <StatLink
      href={`${props.repository.url}/stargazers`}
      label={`${formatFull(props.repository.stars)} stars`}
      className={cn('gap-1.5 font-medium text-fg', props.className)}
    >
      <Star className="size-[1em] fill-star text-star" />
      {formatCompact(props.repository.stars)}
    </StatLink>
  );
}

type RepoStatsProps = {
  repository: Repository;
  className?: string;
};

export function RepoStats(props: RepoStatsProps) {
  const repository = props.repository;

  return (
    <div className={cn('flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-muted', props.className)}>
      <LanguageBadge language={repository.language} />
      <StatLink href={`${repository.url}/forks`} label={`${formatFull(repository.forks)} forks`}>
        <GitFork className="size-3.5" />
        {formatCompact(repository.forks)}
      </StatLink>
      <StatLink href={`${repository.url}/issues`} label={`${formatFull(repository.openIssues)} open issues`}>
        <CircleDot className="size-3.5" />
        {formatCompact(repository.openIssues)}
      </StatLink>
    </div>
  );
}
