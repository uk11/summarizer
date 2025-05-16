import { useQuery } from '@tanstack/react-query';
import { getSummaries } from '@/fetch';

export function useSummaries(isSaved: boolean) {
  return useQuery({
    queryKey: ['summaries', isSaved],
    queryFn: () => getSummaries(isSaved),
  });
}
