import { format } from 'date-fns';
import { AlertCircle, KeyRound, RotateCw, X } from 'lucide-react';
import { GitHubError } from '../lib/github';
import { Button } from './button';

type TokenNoticeProps = {
  onAddToken: () => void;
  onDismiss: () => void;
};

export function TokenNotice(props: TokenNoticeProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl card py-2.5 pr-2 pl-4 text-sm">
      <KeyRound className="size-4 shrink-0 text-muted" />
      <p className="flex-1 text-muted">
        <button
          type="button"
          onClick={props.onAddToken}
          className="cursor-pointer font-medium text-fg underline underline-offset-2"
        >
          Add a GitHub token
        </button>{' '}
        to avoid hitting the rate limit.
      </p>
      <Button variant="ghost" size="icon" className="size-7" onClick={props.onDismiss} aria-label="Dismiss">
        <X className="size-4" />
      </Button>
    </div>
  );
}

type ErrorNoticeProps = {
  error: Error;
  hasToken: boolean;
  onRetry: () => void;
  onOpenSettings: () => void;
};

function getErrorDetails(error: Error, hasToken: boolean) {
  if (!(error instanceof GitHubError)) {
    return { title: 'Something went wrong', description: error.message, showToken: false };
  }

  if (error.kind === 'bad-credentials') {
    return {
      title: 'Invalid GitHub token',
      description: 'Your token was rejected. It may have expired or been revoked.',
      showToken: true,
    };
  }

  if (error.kind === 'rate-limit') {
    const reset = error.resetAt ? ` It resets at ${format(error.resetAt, 'h:mm a')}.` : '';
    return {
      title: 'Rate limit reached',
      description: hasToken
        ? `GitHub's search limit has been reached.${reset}`
        : `GitHub's search limit for anonymous requests has been reached.${reset} Add a token for a higher limit.`,
      showToken: !hasToken,
    };
  }

  if (error.kind === 'network') {
    return {
      title: 'Could not reach GitHub',
      description: 'Check your internet connection and try again.',
      showToken: false,
    };
  }

  return { title: 'GitHub returned an error', description: error.message, showToken: false };
}

export function ErrorNotice(props: ErrorNoticeProps) {
  const details = getErrorDetails(props.error, props.hasToken);

  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/30">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-900 dark:text-red-200">{details.title}</p>
          <p className="mt-1 text-sm text-red-800/80 dark:text-red-200/70">{details.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={props.onRetry}>
              <RotateCw className="size-3.5" />
              Try again
            </Button>
            {details.showToken ? (
              <Button size="sm" variant="primary" onClick={props.onOpenSettings}>
                <KeyRound className="size-3.5" />
                {props.hasToken ? 'Update token' : 'Add token'}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
