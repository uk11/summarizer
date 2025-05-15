'use client';

import { uploadAndSummary } from '@/fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDropzone, FileWithPath } from 'react-dropzone';
import Spinner from '@/components/common/Spinner';
import clsx from 'clsx';
import FileUploadSvg from '@/components/svg-components/FileUploadSvg';

const Dropzone = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        <div className='mb-[20px] max-md:mb-[10px] max-md:scale-90 max-md:z-[-1]'>
          <FileUploadSvg />
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
