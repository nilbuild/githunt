import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

type SegmentedOption<T extends string> = {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
};

type SegmentedControlProps<T extends string> = {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={props.label}
      className={cn('flex h-9 items-center rounded-lg border border-line bg-surface-2 p-0.5', props.className)}
    >
      {props.options.map((option) => {
        const isActive = option.value === props.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.ariaLabel}
            title={option.ariaLabel}
            onClick={() => props.onChange(option.value)}
            className={cn(
              'flex h-full flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-line-strong',
              isActive ? 'bg-surface text-fg shadow-sm dark:bg-surface-3' : 'text-muted hover:text-fg',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
