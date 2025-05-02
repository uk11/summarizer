import { useState } from 'react';
import { useOnClickOutside } from '@/hooks/useOutsideClick';
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';
import DeleteModal from './DeleteModal';

type Props = {
  currentId: string | null;
  setCurrentId: (id: string | null) => void;
  fileName: string;
};

export default function SummaryDropdown({
  currentId,
  setCurrentId,
  fileName,
}: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { targetRef } = useOnClickOutside({
    onClickOutside: () => setCurrentId(null),
  });

  const handleSummaryDelete = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  return (
    <div
      className='absolute p-[8px] w-max border bg-white rounded-[8px]'
      ref={targetRef}
    >
      <div className=''>
        <button className='w-full flex items-center px-[8px] py-[6px] gap-[10px] hover:bg-gray-100 hover:rounded-[8px]'>
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
        isOpen={isDeleteModalOpen}
        onClose={handleSummaryDelete}
        fileName={fileName}
        currentId={currentId}
      />
    </div>
  );
}
