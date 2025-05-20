'use client';

import { uploadAndSummary } from '@/fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDropzone, FileWithPath, FileRejection } from 'react-dropzone';
import Spinner from '@/components/common/Spinner';
import clsx from 'clsx';
import { useToast } from '@/hooks/useToast';
import { useSession } from 'next-auth/react';
import DocxSvg from '@/components/svg-components/DocxSvg';
import PdfSvg from '@/components/svg-components/PdfSvg';
import TxtSvg from '@/components/svg-components/TxtSvg';

const Dropzone = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { status } = useSession();

  const maxSize = status === 'authenticated' ? 5 * 1024 * 1024 : 500 * 1024;

  const { mutate, isPending } = useMutation({
    mutationFn: uploadAndSummary,
    onSuccess: (data) => {
      router.push(`/result/${data.id}`);
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
  });

  const onDrop = (files: FileWithPath[]) => {
    const file = files[0];
    mutate(file);
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

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'flex flex-col justify-center items-center w-[800px] h-[300px] mt-[40px] rounded-[12px] cursor-pointer hover:bg-blue-50',
        'border-2 border-dashed border-blue-500 shadow-lg shadow-blue-100',
        'max-md:w-full max-md:h-[250px]',
        isDragActive && 'bg-blue-50'
      )}
    >
      <input {...getInputProps()} />

      <div className='flex flex-col items-center'>
        <div className='mb-[20px] max-md:mb-[10px] max-md:scale-90 flex gap-[10px]'>
          <PdfSvg />
          <TxtSvg />
          <DocxSvg />
        </div>

        <p className='text-xl max-md:text-base'>
          파일을 드래그하거나 이곳을 클릭해서 업로드하세요.
        </p>
      </div>

      {isPending && <Spinner />}
    </div>
  );
};

export default Dropzone;
