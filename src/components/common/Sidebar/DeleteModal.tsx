import { deleteSummary } from '@/fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  currentId: string | null;
};

export default function DeleteModal({
  isOpen,
  onClose,
  fileName,
  currentId,
}: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: deleteSummary,
    onSuccess: () => {
      router.replace('/');
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
  });

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center z-99'>
      <div className=' bg-white flex justify-center items-center flex-col px-[20px] py-[30px] rounded-[10px] gap-[12px]'>
        <span>
          <span className='font-semibold'>{fileName}</span> 파일을
          삭제하시겠습니까?
        </span>
        <div className='flex justify-end  w-full gap-[10px]'>
          <button className='modal-btn' onClick={onClose}>
            취소
          </button>
          <button
            className='modal-btn'
            onClick={() => currentId && mutate(currentId)}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
