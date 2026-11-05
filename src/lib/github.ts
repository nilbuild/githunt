import { type DateRange, toQueryDate } from './period';

const API_URL = 'https://api.github.com';
export const PAGE_SIZE = 30;
export const MAX_SEARCH_RESULTS = 1000;

export type Repository = {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string;
  homepage: string | null;
  topics: string[];
  owner: {
    login: string;
    avatarUrl: string;
    url: string;
  };
};

export type TrendingPage = {
  start: string;
  end: string;
  totalCount: number;
  repositories: Repository[];
};

type ApiRepository = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  homepage: string | null;
  topics?: string[];
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
};

type ApiSearchResponse = {
  total_count: number;
  items: ApiRepository[];
};

export type GitHubErrorKind = 'bad-credentials' | 'rate-limit' | 'network' | 'unknown';

export class GitHubError extends Error {
  kind: GitHubErrorKind;
  status: number | null;
  resetAt: Date | null;

  constructor(message: string, kind: GitHubErrorKind, status: number | null = null, resetAt: Date | null = null) {
    super(message);
    this.name = 'GitHubError';
    this.kind = kind;
    this.status = status;
    this.resetAt = resetAt;
  }
}

function toRepository(item: ApiRepository): Repository {
  return {
    id: item.id,
    name: item.name,
    fullName: item.full_name,
    url: item.html_url,
    description: item.description,
    language: item.language,
    stars: item.stargazers_count,
    forks: item.forks_count,
    openIssues: item.open_issues_count,
    createdAt: item.created_at,
    homepage: item.homepage || null,
    topics: item.topics ?? [],
    owner: {
      login: item.owner.login,
      avatarUrl: item.owner.avatar_url,
      url: item.owner.html_url,
    },
  };
}

function buildQuery(range: DateRange, languages: string[]) {
  const created = `created:${toQueryDate(range.start)}..${toQueryDate(range.end)}`;
  const qualifiers = languages.map((language) => `language:"${language}"`);

  return [...qualifiers, created].join(' ');
}

async function toGitHubError(response: Response) {
  const body = await response.json().catch(() => null);
  const message: string = body?.message ?? `GitHub responded with ${response.status}`;

  if (response.status === 401) {
    return new GitHubError(message, 'bad-credentials', 401);
  }

  const remaining = response.headers.get('x-ratelimit-remaining');
  const reset = response.headers.get('x-ratelimit-reset');
  const isRateLimited =
    response.status === 429 || (response.status === 403 && (remaining === '0' || /rate limit/i.test(message)));

  if (isRateLimited) {
    const resetAt = reset ? new Date(Number(reset) * 1000) : null;
    return new GitHubError(message, 'rate-limit', response.status, resetAt);
  }

  return new GitHubError(message, 'unknown', response.status);
}

type RequestOptions = {
  token: string;
  signal?: AbortSignal;
};

async function request(path: string, options: RequestOptions) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { headers, signal: options.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new GitHubError('Could not connect to GitHub', 'network');
  }

  if (!response.ok) {
    throw await toGitHubError(response);
  }

  return response;
}

type FetchTrendingOptions = {
  range: DateRange;
  languages: string[];
  token: string;
  page?: number;
  signal?: AbortSignal;
};

export async function fetchTrending(options: FetchTrendingOptions): Promise<TrendingPage> {
  const params = new URLSearchParams({
    q: buildQuery(options.range, options.languages),
    sort: 'stars',
    order: 'desc',
    per_page: String(PAGE_SIZE),
    page: String(options.page ?? 1),
  });

  const response = await request(`/search/repositories?${params}`, options);
  const data: ApiSearchResponse = await response.json();

  return {
    start: options.range.start.toISOString(),
    end: options.range.end.toISOString(),
    totalCount: data.total_count,
    repositories: data.items.map(toRepository),
  };
}
