import { KeyRound } from 'lucide-react';
import { useToken } from '../hooks/use-preferences';
import { buttonClasses } from '../lib/button-classes';
import { cn } from '../lib/cn';
import { GitHubIcon, LogoIcon } from './icons';
import { ThemeToggle } from './theme-toggle';

type HeaderProps = {
  onOpenSettings: () => void;
};

export function Header(props: HeaderProps) {
  const [token] = useToken();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="./" className="flex items-center gap-2.5">
          <LogoIcon className="size-7 text-fg" />
          <span className="font-semibold tracking-tight">GitHunt</span>
        </a>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={props.onOpenSettings}
            className={buttonClasses('ghost', 'sm')}
            aria-label={token ? 'Update GitHub token' : 'Add GitHub token'}
          >
            <KeyRound className="size-4" />
            <span className="hidden sm:inline">{token ? 'Token' : 'Add token'}</span>
            <span className={cn('size-1.5 rounded-full', token ? 'bg-emerald-500' : 'bg-amber-500')} />
          </button>
          <ThemeToggle />
          <a
            href="https://github.com/nilbuild/githunt"
            target="_blank"
            rel="noreferrer"
            className={buttonClasses('ghost', 'icon')}
            aria-label="View source on GitHub"
            title="View source on GitHub"
          >
            <GitHubIcon className="size-4.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
