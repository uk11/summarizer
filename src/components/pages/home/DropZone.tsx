'use client';

import { uploadAndSummary } from '@/fetch';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDropzone, FileWithPath } from 'react-dropzone';
import Spinner from '@/components/common/Spinner';
import clsx from 'clsx';

const Dropzone = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: uploadAndSummary,
    onSuccess: (data) => {
      router.push(`/result/${data.id}`);
      router.refresh();
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
        'flex justify-center items-center w-[800px] h-[300px] mt-[100px] border-2 border-dashed border-blue-500 rounded-xl cursor-pointer hover:bg-blue-50',
        isDragActive && 'bg-blue-50'
      )}
    >
      <input {...getInputProps()} />

      <p>파일을 드래그하거나 클릭해서 업로드하세요.</p>

      {isPending && <Spinner />}
    </div>
  );
};

export default Dropzone;
