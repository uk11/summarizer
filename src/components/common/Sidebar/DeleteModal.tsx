import { useOnClickOutside } from '@/hooks/useOutsideClick';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

type Props = {
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteModal({
  fileName,
  isOpen,
  onClose,
  onDelete,
}: Props) {
  const { targetRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center z-[20]'>
      <div
        className={clsx(
          'bg-white text-black flex justify-center flex-col px-[20px] py-[20px] rounded-[10px]',
          ' max-md:w-full max-md:mx-[20px] dark-mode dark-modal-deep'
        )}
        ref={targetRef}
      >
        <div className='mb-[10px]'>
          <p>
            <span className='font-semibold'>{fileName}</span> 파일을
            삭제하시겠습니까?
          </p>
          <p>삭제 시 채팅 목록 및 저장 목록에서 제거됩니다.</p>
        </div>

        <div className='flex justify-end w-full gap-[10px]'>
          <button
            className='basic-btn hover:dark:bg-dark-500'
            onClick={onClose}
          >
            취소
          </button>

          <button className='basic-red-btn' onClick={onDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
