import { Check, ChevronsUpDown, Search } from 'lucide-react';
import {
  type KeyboardEvent,
  memo,
  startTransition,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { buttonClasses } from '../lib/button-classes';
import { cn } from '../lib/cn';
import { ALL_LANGUAGES, getLanguageColor, POPULAR_LANGUAGES } from '../lib/languages';
import { MAX_LANGUAGES } from '../lib/url-state';
import { Button } from './button';

const INITIAL_RENDER_COUNT = 40;

type LanguageSelectProps = {
  value: string[];
  onChange: (languages: string[]) => void;
};

type Option = {
  key: string;
  value: string;
  section?: string;
};

function withSection(languages: string[], prefix: string, section: string): Option[] {
  return languages.map((language, index) => ({
    key: `${prefix}-${language}`,
    value: language,
    section: index === 0 ? section : undefined,
  }));
}

function buildOptions(query: string, pinned: string[]): Option[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [
      { key: 'all', value: '' },
      ...withSection(pinned, 'selected', 'Selected'),
      ...withSection(POPULAR_LANGUAGES, 'popular', 'Popular'),
      ...withSection(ALL_LANGUAGES, 'every', 'All languages'),
    ];
  }

  const matches = ALL_LANGUAGES.filter((language) => language.toLowerCase().includes(normalized));
  const prefixMatches = matches.filter((language) => language.toLowerCase().startsWith(normalized));
  const otherMatches = matches.filter((language) => !language.toLowerCase().startsWith(normalized));

  return [...prefixMatches, ...otherMatches].map((language) => ({ key: language, value: language }));
}

function isSameSelection(a: string[], b: string[]) {
  if (a.length !== b.length) {
    return false;
  }

  const set = new Set(a);
  return b.every((language) => set.has(language));
}

function ColorDot(props: { language: string; className?: string }) {
  return (
    <span
      className={cn('size-2.5 shrink-0 rounded-full', props.className)}
      style={{ backgroundColor: getLanguageColor(props.language) }}
    />
  );
}

function TriggerLabel(props: { value: string[] }) {
  if (props.value.length === 0) {
    return <span className="truncate">All languages</span>;
  }

  if (props.value.length === 1) {
    return (
      <>
        <ColorDot language={props.value[0]} />
        <span className="truncate">{props.value[0]}</span>
      </>
    );
  }

  return (
    <>
      <span className="flex shrink-0 -space-x-1">
        {props.value.slice(0, 3).map((language) => (
          <ColorDot key={language} language={language} className="ring-2 ring-surface" />
        ))}
      </span>
      <span className="truncate">
        {props.value[0]} <span className="text-muted">+{props.value.length - 1}</span>
      </span>
    </>
  );
}

type LanguageOptionProps = {
  id: string;
  index: number;
  option: Option;
  isSelected: boolean;
  isActive: boolean;
  isDisabled: boolean;
  onSelect: (index: number) => void;
  onHover: (index: number) => void;
};

const LanguageOption = memo(function LanguageOption(props: LanguageOptionProps) {
  const isAll = props.option.value === '';

  return (
    <div className="[contain-intrinsic-size:auto_32px] [content-visibility:auto]">
      {props.option.section ? (
        <p className="px-2.5 pt-2.5 pb-1 text-xs font-medium text-muted">{props.option.section}</p>
      ) : null}
      <div
        id={props.id}
        data-index={props.index}
        role="option"
        aria-selected={props.isSelected}
        aria-disabled={props.isDisabled}
        onMouseMove={() => props.onHover(props.index)}
        onClick={() => props.onSelect(props.index)}
        className={cn(
          'flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm',
          props.isActive && 'bg-surface-2',
          props.isDisabled && 'cursor-not-allowed opacity-40',
        )}
      >
        {isAll ? (
          <span className="size-2.5 shrink-0 rounded-full border border-line-strong" />
        ) : (
          <ColorDot language={props.option.value} />
        )}
        <span className="flex-1 truncate">{isAll ? 'All languages' : props.option.value}</span>
        {props.isSelected ? <Check className="size-4 text-muted" /> : null}
      </div>
    </div>
  );
});

export function LanguageSelect(props: LanguageSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [draft, setDraft] = useState<string[]>(props.value);
  const [pinned, setPinned] = useState<string[]>([]);
  const [isFullyRendered, setFullyRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const options = useMemo(() => buildOptions(query, pinned), [query, pinned]);
  const draftSet = useMemo(() => new Set(draft), [draft]);
  const isAtLimit = draft.length >= MAX_LANGUAGES;

  const visibleOptions = isFullyRendered ? options : options.slice(0, INITIAL_RENDER_COUNT);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => startTransition(() => setFullyRendered(true)));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const onChange = props.onChange;
  const value = props.value;

  const open = () => {
    setQuery('');
    setActiveIndex(0);
    setDraft(value);
    setPinned(value);
    setFullyRendered(false);
    setIsOpen(true);
  };

  const close = useCallback(
    (shouldCommit: boolean, next?: string[]) => {
      setIsOpen(false);
      const selection = next ?? draft;
      if (shouldCommit && !isSameSelection(selection, value)) {
        onChange(selection);
      }
    },
    [draft, value, onChange],
  );

  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  }, [close]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }
      close(true);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const activeElement = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    activeElement?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const selectIndex = useCallback(
    (index: number) => {
      const option = optionsRef.current[index];
      if (!option) {
        return;
      }

      if (option.value === '') {
        setDraft([]);
        closeRef.current(true, []);
        return;
      }

      setDraft((current) => {
        if (current.includes(option.value)) {
          return current.filter((language) => language !== option.value);
        }
        if (current.length >= MAX_LANGUAGES) {
          return current;
        }
        return [...current, option.value];
      });
    },
    [],
  );

  const hoverIndex = useCallback((index: number) => setActiveIndex(index), []);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, options.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.metaKey || event.ctrlKey) {
        close(true);
        return;
      }
      selectIndex(activeIndex);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      close(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => (isOpen ? close(true) : open())}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(buttonClasses('secondary', 'md'), 'w-full justify-between! px-3 sm:w-52')}
      >
        <span className="flex min-w-0 items-center gap-2">
          <TriggerLabel value={props.value} />
        </span>
        <ChevronsUpDown className="size-4 text-subtle" />
      </button>

      {isOpen ? (
        <div className="absolute top-full left-0 z-40 mt-2 w-full min-w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-xl shadow-black/10 sm:w-72 dark:shadow-black/50">
          <div className="flex items-center gap-2 border-b border-line px-3">
            <Search className="size-4 text-subtle" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search languages…"
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={options[activeIndex] ? `${listId}-${activeIndex}` : undefined}
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-subtle"
            />
          </div>

          <div ref={listRef} id={listId} role="listbox" aria-multiselectable className="max-h-80 overflow-y-auto p-1">
            {options.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted">No languages found</p>
            ) : null}
            {visibleOptions.map((option, index) => {
              const isAll = option.value === '';
              const isSelected = isAll ? draft.length === 0 : draftSet.has(option.value);

              return (
                <LanguageOption
                  key={option.key}
                  id={`${listId}-${index}`}
                  index={index}
                  option={option}
                  isSelected={isSelected}
                  isActive={index === activeIndex}
                  isDisabled={!isAll && !isSelected && isAtLimit}
                  onSelect={selectIndex}
                  onHover={hoverIndex}
                />
              );
            })}
          </div>

          {draft.length > 0 ? (
            <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
              <span className="text-xs text-muted">
                {draft.length} of {MAX_LANGUAGES} selected
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setDraft([])}>
                  Clear
                </Button>
                <Button variant="primary" size="sm" className="h-7 px-2.5 text-xs" onClick={() => close(true)}>
                  Done
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
