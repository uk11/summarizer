import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useUpload<T>(
  mutationFn: (payload: T) => Promise<{ id: string }>
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      router.push(`/result/${data.id}`);
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
  });
}
