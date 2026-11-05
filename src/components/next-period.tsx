import { History } from 'lucide-react';
import type { ViewType } from '../hooks/use-preferences';
import { formatRange, getLoadLabel, getRange, getRangeTitle, type Period } from '../lib/period';
import { Button } from './button';
import { ErrorNotice } from './notices';
import { PeriodHeader } from './period-header';
import { GroupSkeleton } from './skeletons';

type NextPeriodProps = {
  period: Period;
  index: number;
  view: ViewType;
  isLoading: boolean;
  error: Error | null;
  hasToken: boolean;
  onLoad: () => void;
  onRetry: () => void;
  onOpenSettings: () => void;
};

function NextPeriodBody(props: NextPeriodProps & { title: string; rangeLabel: string }) {
  if (props.isLoading) {
    return <GroupSkeleton view={props.view} />;
  }

  if (props.error) {
    return (
      <ErrorNotice
        error={props.error}
        hasToken={props.hasToken}
        onRetry={props.onRetry}
        onOpenSettings={props.onOpenSettings}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
      <p className="text-sm text-muted">Top repositories from {props.rangeLabel}</p>
      <Button variant="primary" onClick={props.onLoad}>
        <History className="size-4" />
        Load {getLoadLabel(props.title)}
      </Button>
    </div>
  );
}

export function NextPeriod(props: NextPeriodProps) {
  const range = getRange(props.period, props.index);
  const title = getRangeTitle(props.period, props.index, range);

  return (
    <section>
      <PeriodHeader period={props.period} index={props.index} range={range} />
      <NextPeriodBody {...props} title={title} rangeLabel={formatRange(range)} />
    </section>
  );
}
