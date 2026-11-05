import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTrending } from '../lib/github';
import { getRange, type Period, toQueryDate } from '../lib/period';

type UseTrendingOptions = {
  period: Period;
  languages: string[];
  token: string;
};

export function useTrending(options: UseTrendingOptions) {
  return useInfiniteQuery({
    queryKey: ['trending', options.period, [...options.languages].sort().join(','), toQueryDate(new Date())],
    initialPageParam: 0,
    queryFn: (context) =>
      fetchTrending({
        range: getRange(options.period, context.pageParam),
        languages: options.languages,
        token: options.token,
        signal: context.signal,
      }),
    getNextPageParam: (_lastPage, _pages, lastPageParam) => lastPageParam + 1,
  });
}
