import { useOnClickOutside } from '@/hooks/useOutsideClick';
import { createPortal } from 'react-dom';

type Props = {
  isDeleteModalOpen: boolean;
  fileName: string;
  currentId: string | null;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteModal({
  isDeleteModalOpen,
  onClose,
  fileName,
  onDelete,
}: Props) {
  const { targetRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  if (!isDeleteModalOpen) return null;

  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center'>
      <div
        className='bg-white flex justify-center items-center flex-col px-[20px] py-[30px] rounded-[10px] gap-[12px]'
        ref={targetRef}
      >
        <span>
          <span className='font-semibold'>{fileName}</span> 파일을
          삭제하시겠습니까?
        </span>
        <div className='flex justify-end  w-full gap-[10px]'>
          <button className='modal-btn' onClick={onClose}>
            취소
          </button>
          <button className='modal-btn' onClick={onDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
