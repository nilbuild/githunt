import { formatFull } from '../lib/format';
import { type DateRange, formatRange, getRangeTitle, type Period } from '../lib/period';

type PeriodHeaderProps = {
  period: Period;
  index: number;
  range: DateRange;
  totalCount?: number;
};

export function PeriodHeader(props: PeriodHeaderProps) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="flex flex-wrap items-baseline gap-x-2.5">
        <span className="text-lg font-semibold tracking-tight">
          {getRangeTitle(props.period, props.index, props.range)}
        </span>
        <span className="text-sm text-muted">{formatRange(props.range)}</span>
      </h2>
      {props.totalCount ? (
        <span className="shrink-0 text-xs text-subtle tabular-nums">{formatFull(props.totalCount)} repos</span>
      ) : null}
    </div>
  );
}
