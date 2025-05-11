import { useOnClickOutside } from '@/hooks/useOutsideClick';
import { createPortal } from 'react-dom';

type Props = {
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function SaveModal({
  fileName,
  isOpen,
  onClose,
  onSave,
}: Props) {
  const { targetRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center'>
      <div
        className='bg-white flex justify-center items-center flex-col px-[20px] py-[30px] rounded-[10px] gap-[12px]'
        ref={targetRef}
      >
        <span>
          <span className='font-semibold'>{fileName}</span> 파일을
          저장하시겠습니까?
        </span>
        <div className='flex justify-end  w-full gap-[10px]'>
          <button className='basic-btn' onClick={onClose}>
            취소
          </button>
          <button className='basic-btn' onClick={onSave}>
            저장
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
