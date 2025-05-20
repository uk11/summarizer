'use client';

import { uploadFile, uploadText } from '@/fetch';
import { useDropzone, FileWithPath, FileRejection } from 'react-dropzone';
import Spinner from '@/components/common/Spinner';
import clsx from 'clsx';
import { useToast } from '@/hooks/useToast';
import { useSession } from 'next-auth/react';
import DocxSvg from '@/components/svg-components/DocxSvg';
import PdfSvg from '@/components/svg-components/PdfSvg';
import TxtSvg from '@/components/svg-components/TxtSvg';
import { useRef, useState } from 'react';
import { useUpload } from '@/hooks/query/useUpload';

const Dropzone = () => {
  const { showToast } = useToast();
  const { status } = useSession();
  const [isTextMode, setIsTextMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const maxSize = status === 'authenticated' ? 5 * 1024 * 1024 : 500 * 1024;

  const { mutate: fileMutate, isPending: isFilePending } =
    useUpload(uploadFile);
  const { mutate: textMutate, isPending: isTextPending } =
    useUpload(uploadText);

  const onDrop = (files: FileWithPath[]) => {
    const file = files[0];
    fileMutate(file);
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    const isInvalidFileType =
      fileRejections[0]?.errors[0]?.code === 'file-invalid-type';

    if (isInvalidFileType) {
      showToast('지원되지 않는 파일 형식입니다.', 'error');
      return;
    }

    if (status === 'authenticated') {
      showToast('5MB 미만의 파일만 업로드할 수 있습니다.', 'error');
    } else {
      showToast(
        '비로그인 유저는 500KB 미만의 파일만 업로드할 수 있습니다.',
        'error'
      );
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxSize,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
  });

  return isTextMode ? (
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
        <button
          className='basic-btn'
          onClick={() => {
            setIsTextMode(false);
          }}
        >
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
  ) : (
    <div
      {...getRootProps()}
      className={clsx(
        'flex flex-col justify-center items-center w-[800px] h-[300px] mt-[40px] rounded-[12px] cursor-pointer hover:bg-blue-50 p-[16px]',
        'border-2 border-dashed border-blue-500 shadow-lg shadow-blue-100',
        'max-md:w-full max-md:h-[250px]',
        isDragActive && 'bg-blue-50'
      )}
    >
      <input {...getInputProps()} />

      <div className='flex flex-col items-center justify-center h-full'>
        <div className='mb-[20px] max-md:mb-[10px] max-md:scale-90 flex gap-[10px]'>
          <PdfSvg />
          <TxtSvg />
          <DocxSvg />
        </div>

        <p className='text-xl max-md:text-base'>
          파일을 드래그하거나 이곳을 클릭해서 업로드하세요.
        </p>
      </div>

      <button
        className='self-start basic-btn'
        onClick={(e) => {
          e.stopPropagation();
          setIsTextMode(true);
        }}
      >
        직접 입력하기
      </button>

      {isFilePending && <Spinner />}
    </div>
  );
};

export default Dropzone;
