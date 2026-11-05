import { ChevronDown, Loader2 } from 'lucide-react';
import { formatFull } from '../lib/format';
import { cn } from '../lib/cn';
import { Button } from './button';

type ShowMoreBarProps = {
  shown: number;
  available: number;
  isLoading: boolean;
  onShowMore: () => void;
  className?: string;
};

export function ShowMoreBar(props: ShowMoreBarProps) {
  const progress = props.available > 0 ? Math.min(props.shown / props.available, 1) : 0;

  return (
    <div className={cn('flex items-center justify-between gap-4 py-2.5 pr-2.5 pl-4 sm:pl-5', props.className)}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-sm whitespace-nowrap text-muted">
          Showing <span className="font-medium text-fg tabular-nums">{formatFull(props.shown)}</span> of{' '}
          <span className="tabular-nums">{formatFull(props.available)}</span>
        </span>
        <div className="hidden h-1 w-28 overflow-hidden rounded-full bg-surface-3 sm:block">
          <div className="h-full rounded-full bg-fg transition-[width]" style={{ width: `${Math.max(progress * 100, 2)}%` }} />
        </div>
      </div>
      <Button size="sm" onClick={props.onShowMore} disabled={props.isLoading}>
        {props.isLoading ? <Loader2 className="size-4 animate-spin" /> : <ChevronDown className="size-4" />}
        Show 30 more
      </Button>
    </div>
  );
}
