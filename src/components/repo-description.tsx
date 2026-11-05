import { cn } from '../lib/cn';

type RepoDescriptionProps = {
  description: string | null;
  className?: string;
};

export function RepoDescription(props: RepoDescriptionProps) {
  if (!props.description) {
    return <p className={cn('text-sm text-subtle italic', props.className)}>No description</p>;
  }

  return <p title={props.description} className={cn('text-sm text-pretty text-muted', props.className)}>
      {props.description}
    </p>;
}
