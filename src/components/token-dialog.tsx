import { ExternalLink, X } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useToken } from '../hooks/use-preferences';
import { Button } from './button';

type TokenDialogProps = {
  open: boolean;
  onClose: () => void;
};

const NEW_TOKEN_URL = 'https://github.com/settings/personal-access-tokens/new?name=GitHunt&description=Read-only%20token%20for%20GitHunt';

export function TokenDialog(props: TokenDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useToken();
  const [draft, setDraft] = useState(token);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (props.open && !dialog.open) {
      setDraft(token);
      dialog.showModal();
      inputRef.current?.focus();
      return;
    }

    if (!props.open && dialog.open) {
      dialog.close();
    }
  }, [props.open, token]);

  const save = (event: FormEvent) => {
    event.preventDefault();
    setToken(draft.trim());
    props.onClose();
  };

  const remove = () => {
    setToken('');
    props.onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={props.onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={save} className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">GitHub token</h2>
            <p className="mt-1 text-sm text-muted">
              Without a token GitHub allows only 10 searches per minute. A token raises that to 30.
            </p>
          </div>
          <Button variant="ghost" size="icon" className="-mt-1 -mr-2 size-8" onClick={props.onClose} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>

        <ol className="mt-5 list-decimal space-y-1.5 pl-5 text-sm text-muted marker:text-subtle">
          <li>
            <a
              href={NEW_TOKEN_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-fg underline underline-offset-2"
            >
              Create a fine-grained token
              <ExternalLink className="size-3.5" />
            </a>
          </li>
          <li>Keep "Public repositories" access. No extra permissions needed.</li>
          <li>Generate it and paste it below.</li>
        </ol>

        <label htmlFor="github-token" className="mt-5 block text-sm font-medium">
          Token
        </label>
        <input
          ref={inputRef}
          id="github-token"
          type="password"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="github_pat_…"
          autoComplete="off"
          spellCheck={false}
          className="mt-1.5 h-10 w-full rounded-lg border border-line bg-canvas px-3 font-mono text-sm outline-none placeholder:text-subtle focus:border-line-strong focus:ring-2 focus:ring-surface-3"
        />
        <p className="mt-2 text-xs text-muted">
          Stored only in this browser and sent only to api.github.com.
        </p>

        <div className="mt-6 flex items-center justify-between gap-2">
          {token ? (
            <Button variant="ghost" onClick={remove} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
              Remove token
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button onClick={props.onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={!draft.trim() || draft.trim() === token}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
