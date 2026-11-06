import type { ViewType } from '../hooks/use-preferences';
import { cn } from '../lib/cn';
import { PAGE_SIZE } from '../lib/github';

function Bar(props: { className: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-3', props.className)} />;
}

function FooterSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 pr-2.5 pl-4 sm:pl-5">
      <Bar className="h-4 w-32" />
      <Bar className="h-8 w-28 rounded-lg" />
    </div>
  );
}

export function GroupSkeleton(props: { view: ViewType }) {
  const items = Array.from({ length: PAGE_SIZE }, (_, index) => index);

  if (props.view === 'grid') {
    return (
      <div aria-busy="true" aria-label="Loading repositories">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="card flex min-h-[255px] flex-col p-5">
              <div className="flex items-center gap-2">
                <Bar className="size-6 rounded-full" />
                <Bar className="h-4 w-24" />
              </div>
              <Bar className="mt-4 h-5 w-2/3" />
              <Bar className="mt-3 h-4 w-full" />
              <Bar className="mt-2 h-4 w-4/5" />
              <Bar className="mt-auto h-3 w-1/2" />
            </div>
          ))}
        </div>
        <div className="card mt-3 rounded-xl">
          <FooterSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div aria-busy="true" aria-label="Loading repositories" className="card divide-y divide-line overflow-hidden">
      {items.map((item) => (
        <div key={item} className="flex gap-4 px-4 py-4 sm:px-5">
          <Bar className="size-9 shrink-0 rounded-full" />
          <div className="flex-1">
            <Bar className="h-5 w-1/3" />
            <Bar className="mt-2 h-4 w-3/4" />
            <Bar className="mt-4 h-4 w-1/3" />
          </div>
          <Bar className="h-7 w-14 rounded-full" />
        </div>
      ))}
      <div className="bg-surface-2">
        <FooterSkeleton />
      </div>
    </div>
  );
}
