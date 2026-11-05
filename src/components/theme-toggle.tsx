import { Monitor, Moon, Sun } from 'lucide-react';
import { type Theme, useTheme } from '../hooks/use-theme';
import { cn } from '../lib/cn';

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'system', label: 'System theme', icon: Monitor },
  { value: 'light', label: 'Light theme', icon: Sun },
  { value: 'dark', label: 'Dark theme', icon: Moon },
];

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <div role="radiogroup" aria-label="Theme" className="flex items-center rounded-full border border-line bg-surface p-0.5">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={cn(
              'flex size-7 cursor-pointer items-center justify-center rounded-full transition',
              isActive ? 'bg-surface-3 text-fg' : 'text-subtle hover:text-fg',
            )}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
