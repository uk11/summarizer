import Spinner from '@/components/common/Spinner';
import { uploadText } from '@/fetch';
import { useUpload } from '@/hooks/query/useUpload';
import { useToast } from '@/hooks/useToast';
import clsx from 'clsx';
import { useRef, useState } from 'react';

type Props = {
  onSwitch: () => void;
};

export default function TextArea({ onSwitch }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState('');

  const { showToast } = useToast();

  const { mutate: textMutate, isPending: isTextPending } =
    useUpload(uploadText);

  const handleFocus = () => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      const diff = window.innerHeight - viewport.height;
      if (diff > 100) {
        setTimeout(() => {
          textareaRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      }
      viewport.removeEventListener('resize', handleResize);
    };

    viewport.addEventListener('resize', handleResize);
  };

  return (
    <div
      className={clsx(
        'flex flex-col justify-center items-center w-[800px] h-[300px] rounded-[12px] p-[16px] bg-white',
        'border-2 border-blue-300 shadow-lg shadow-blue-100 text-black',
        'max-md:w-full max-md:h-[250px] dark:shadow-md dark:shadow-blue-300'
      )}
    >
      <textarea
        ref={textareaRef}
        className='w-full h-full resize-none outline-none'
        placeholder='요약할 내용을 입력해 주세요.'
        onFocus={handleFocus}
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 1000))}
      />

      <div className='flex justify-between w-full mt-[10px]'>
        <button className='basic-btn' onClick={onSwitch}>
          파일 업로드하기
        </button>

        <div className='flex items-center gap-[20px] max-md:gap-[10px] text-[#555555]'>
          {`${text.length} / 1000`}

          <button
            className='blue-btn'
            onClick={() => {
              if (!text)
                return showToast('요약할 내용을 입력해 주세요.', 'error');
              textMutate(text);
            }}
          >
            요약하기
          </button>
        </div>
      </div>

      {isTextPending && <Spinner />}
    </div>
  );
}
