import Spinner from '@/components/common/Spinner';
import { uploadText } from '@/fetch';
import { useUpload } from '@/hooks/query/useUpload';
import { useToast } from '@/hooks/useToast';
import clsx from 'clsx';
import { useRef } from 'react';

type Props = {
  onSwitch: () => void;
};

export default function TextArea({ onSwitch }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { showToast } = useToast();

  const { mutate: textMutate, isPending: isTextPending } =
    useUpload(uploadText);

  return (
    <div
      className={clsx(
        'flex flex-col justify-center items-center w-[800px] h-[300px] mt-[40px] rounded-[12px] p-[16px]',
        'border-2 border-blue-300 shadow-lg shadow-blue-100',
        'max-md:w-full max-md:h-[250px]'
      )}
    >
      <textarea
        ref={textareaRef}
        className='w-full h-full resize-none outline-none'
        placeholder='요약 내용을 입력해주세요.'
      />

      <div className='flex justify-between w-full mt-[10px]'>
        <button className='basic-btn' onClick={onSwitch}>
          파일 업로드하기
        </button>

        <button
          className='blue-btn'
          onClick={() => {
            if (textareaRef.current?.value) {
              textMutate(textareaRef.current.value);
            } else showToast('요약 내용을 입력해 주세요.', 'error');
          }}
        >
          요약하기
        </button>
      </div>

      {isTextPending && <Spinner />}
    </div>
  );
}
