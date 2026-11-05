import type { ViewType } from '../hooks/use-preferences';
import { cn } from '../lib/cn';

function Bar(props: { className: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-3', props.className)} />;
}

export function GroupSkeleton(props: { view: ViewType }) {
  const items = [0, 1, 2, 3, 4, 5];

  return (
    <section aria-busy="true" aria-label="Loading repositories">
      <div className="mb-3 flex items-baseline gap-3">
        <Bar className="h-6 w-28" />
        <Bar className="h-4 w-32" />
      </div>

      {props.view === 'grid' ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="card p-4">
              <div className="flex items-center gap-2">
                <Bar className="size-6 rounded-full" />
                <Bar className="h-4 w-24" />
              </div>
              <Bar className="mt-4 h-5 w-2/3" />
              <Bar className="mt-3 h-4 w-full" />
              <Bar className="mt-2 h-4 w-4/5" />
              <Bar className="mt-5 h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="card divide-y divide-line">
          {items.map((item) => (
            <div key={item} className="flex gap-4 px-4 py-4 sm:px-5">
              <Bar className="size-9 shrink-0 rounded-full" />
              <div className="flex-1">
                <Bar className="h-5 w-1/3" />
                <Bar className="mt-2 h-4 w-3/4" />
                <Bar className="mt-3 h-3 w-1/3" />
              </div>
              <Bar className="h-7 w-14 rounded-full" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
