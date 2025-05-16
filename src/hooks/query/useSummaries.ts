import { useQuery } from '@tanstack/react-query';
import { getSummaries } from '@/fetch'; // 경로는 너 프로젝트에 맞게 수정

export function useSummaries(isSaved: boolean) {
  return useQuery({
    queryKey: ['summaries', isSaved],
    queryFn: () => getSummaries(isSaved),
  });
}
