import { useState } from 'react';
import { useOnClickOutside } from '@/hooks/useOutsideClick';
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';
import DeleteModal from './DeleteModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { deleteSummary } from '@/fetch';

type Props = {
  currentId: string | null;
  setCurrentId: (id: string | null) => void;
  fileName: string;
  onEdit: () => void;
};

export default function SummaryDropdown({
  currentId,
  setCurrentId,
  fileName,
  onEdit,
}: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSummaryDelete = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const { targetRef } = useOnClickOutside({
    onClickOutside: () => {
      if (!isDeleteModalOpen) setCurrentId(null);
    },
  });

  const { mutate } = useMutation({
    mutationFn: deleteSummary,
    onSuccess: () => {
      setCurrentId(null);
      router.replace('/');
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
  });

  return (
    <div
      className='fixed p-[8px] w-max border bg-white rounded-[8px] z-10'
      ref={targetRef}
    >
      <div className=''>
        <button
          className='w-full flex items-center px-[8px] py-[6px] gap-[10px] hover:bg-gray-100 hover:rounded-[8px]'
          onClick={onEdit}
        >
          <RiEdit2Line className='w-[20px] h-[20px]' />
          제목 수정
        </button>

        <button
          className='w-full flex items-center px-[8px] py-[6px] gap-[10px] hover:bg-gray-100 hover:rounded-[8px]'
          onClick={handleSummaryDelete}
        >
          <RiDeleteBinLine className='w-[20px] h-[20px]' />
          삭제
        </button>
      </div>

      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        fileName={fileName}
        currentId={currentId}
        onClose={() => {
          setIsDeleteModalOpen(!isDeleteModalOpen);
          setCurrentId(null);
        }}
        onDelete={() => {
          if (currentId) mutate(currentId);
        }}
      />
    </div>
  );
}
