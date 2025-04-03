'use client';

import { uploadAndSummary } from '@/fetch';
import { useMutation } from '@tanstack/react-query';
// import { useRouter } from 'next/navigation';
import { useDropzone, FileWithPath } from 'react-dropzone';

const Dropzone = () => {
  // const router = useRouter();

  const { mutate, data, isPending } = useMutation({
    mutationFn: uploadAndSummary,
  });

  const onDrop = (files: FileWithPath[]) => {
    const file = files[0];
    mutate(file);
  };
  console.log(JSON.stringify(data));
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className='w-[1500px] h-[500px] border border-gray-400 rounded-xl p-10 text-center cursor-pointer hover:bg-gray-100'
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className='text-blue-500'>여기에 파일을 놓으세요...</p>
      ) : (
        <p className='text-gray-600'>
          파일을 드래그하거나 클릭해서 업로드하세요
        </p>
      )}
      {isPending && <div className='mt-4 text-blue-500'>분석 중입니다...</div>}
      {data && <div className='mt-4 text-left'>{data.summary}</div>}
    </div>
  );
};

export default Dropzone;
