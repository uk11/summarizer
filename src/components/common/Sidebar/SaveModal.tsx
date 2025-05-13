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
        className='bg-white flex justify-center flex-col px-[20px] py-[20px] rounded-[10px]'
        ref={targetRef}
      >
        <div className='mb-[10px]'>
          <p>
            <span className='font-semibold'>{fileName}</span> 파일을
            저장하시겠습니까?
          </p>
          <p>저장 목록은 계정 정보에서 확인할 수 있습니다. </p>
        </div>

        <div className='flex justify-end w-full gap-[10px]'>
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
