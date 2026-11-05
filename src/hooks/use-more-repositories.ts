import { useQueries } from '@tanstack/react-query';
import { fetchTrending, type Repository, type TrendingPage } from '../lib/github';

type UseMoreRepositoriesOptions = {
  page: TrendingPage;
  languages: string[];
  token: string;
  extraPages: number;
};

function dedupe(repositories: Repository[]) {
  const seen = new Set<number>();

  return repositories.filter((repository) => {
    if (seen.has(repository.id)) {
      return false;
    }
    seen.add(repository.id);
    return true;
  });
}

export function useMoreRepositories(options: UseMoreRepositoriesOptions) {
  const languagesKey = [...options.languages].sort().join(',');
  const range = { start: new Date(options.page.start), end: new Date(options.page.end) };

  const queries = useQueries({
    queries: Array.from({ length: options.extraPages }, (_, index) => {
      const pageNumber = index + 2;

      return {
        queryKey: ['trending-page', languagesKey, options.page.start, options.page.end, pageNumber],
        queryFn: (context: { signal: AbortSignal }) =>
          fetchTrending({
            range,
            languages: options.languages,
            token: options.token,
            page: pageNumber,
            signal: context.signal,
          }),
      };
    }),
  });

  const lastQuery = queries.at(-1);
  const extraRepositories = queries.flatMap((query) => query.data?.repositories ?? []);

  return {
    repositories: dedupe([...options.page.repositories, ...extraRepositories]),
    lastPageSize: lastQuery?.data?.repositories.length ?? options.page.repositories.length,
    isLoading: queries.some((query) => query.isFetching),
    error: queries.find((query) => query.error)?.error ?? null,
    retry: () => queries.filter((query) => query.error).forEach((query) => query.refetch()),
  };
}
