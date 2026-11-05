import { Bookmark, Check, ChevronDown, X } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { type SavedView, useSavedViews } from '../hooks/use-preferences';
import { buttonClasses } from '../lib/button-classes';
import { cn } from '../lib/cn';
import { describeFilters, type Filters, matchesFilters, MAX_SAVED_VIEWS, suggestName } from '../lib/saved-views';
import { Button } from './button';

type ViewsMenuProps = {
  filters: Filters;
  onApply: (view: SavedView) => void;
};

type SaveFormProps = {
  filters: Filters;
  activeView: SavedView | undefined;
  isFull: boolean;
  onSave: (name: string) => void;
};

function SaveForm(props: SaveFormProps) {
  const [name, setName] = useState('');
  const inputId = useId();
  const suggestion = suggestName(props.filters);

  if (props.activeView) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Check className="size-4 shrink-0" />
        Saved as “{props.activeView.name}”
      </p>
    );
  }

  if (props.isFull) {
    return <p className="text-sm text-muted">You can keep up to {MAX_SAVED_VIEWS} views. Delete one to save another.</p>;
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    props.onSave(name.trim() || suggestion);
    setName('');
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <label htmlFor={inputId} className="sr-only">
        View name
      </label>
      <input
        id={inputId}
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={suggestion}
        maxLength={40}
        autoComplete="off"
        className="h-8 min-w-0 flex-1 rounded-lg border border-line bg-surface px-2.5 text-sm outline-none placeholder:text-subtle focus:border-line-strong"
      />
      <Button type="submit" variant="primary" size="sm" className="focus-visible:ring-0 focus-visible:ring-offset-0">
        Save
      </Button>
    </form>
  );
}

export function ViewsMenu(props: ViewsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [views, setViews] = useSavedViews();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const activeView = views.find((view) => matchesFilters(view, props.filters));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const apply = (view: SavedView) => {
    setIsOpen(false);
    props.onApply(view);
  };

  const save = (name: string) => {
    const view: SavedView = { id: crypto.randomUUID(), name, ...props.filters };
    setViews([...views, view]);
  };

  const remove = (id: string) => {
    setViews(views.filter((view) => view.id !== id));
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={cn(buttonClasses('secondary', 'md'), 'w-full justify-between! gap-2 px-3 focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-auto sm:max-w-56')}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Bookmark className={cn('size-4 shrink-0', activeView ? 'fill-current' : 'text-muted')} />
          <span className="truncate">{activeView?.name ?? 'Views'}</span>
        </span>
        <ChevronDown className={cn('size-4 shrink-0 text-subtle transition', isOpen && 'rotate-180')} />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          className="absolute top-full left-0 z-40 mt-2 w-full min-w-72 overflow-hidden rounded-xl border border-line bg-surface shadow-xl shadow-black/10 sm:w-80 dark:shadow-black/50"
        >
          {views.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto p-1">
              {views.map((view) => {
                const isActive = view.id === activeView?.id;

                return (
                  <li key={view.id} className="group flex items-center rounded-lg hover:bg-surface-2">
                    <button
                      type="button"
                      onClick={() => apply(view)}
                      aria-current={isActive ? 'true' : undefined}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left outline-none focus-visible:bg-surface-2"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{view.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted">{describeFilters(view)}</span>
                      </span>
                      {isActive ? <Check className="size-4 shrink-0 text-muted" /> : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(view.id)}
                      aria-label={`Delete ${view.name}`}
                      title="Delete view"
                      className="mr-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-subtle opacity-60 transition outline-none hover:bg-surface-3 hover:text-fg group-hover:opacity-100 focus-visible:bg-surface-3 focus-visible:opacity-100"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <div className={cn('flex flex-col gap-2.5 p-3', views.length > 0 && 'border-t border-line')}>
            {views.length === 0 ? (
              <p className="text-sm text-muted">Save these filters to switch back to them in one click.</p>
            ) : null}
            <SaveForm
              filters={props.filters}
              activeView={activeView}
              isFull={views.length >= MAX_SAVED_VIEWS}
              onSave={save}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
