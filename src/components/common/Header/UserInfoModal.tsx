import XSvg from '@/components/svg-components/XSvg';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useOnClickOutside } from '@/hooks/useOutsideClick';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/lib/day';
import { deleteSummary, getSummary } from '@/fetch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteModal from '../Sidebar/DeleteModal';
import { useToast } from '@/hooks/useToast';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserInfoModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { data: session } = useSession();
  const { showToast } = useToast();

  const { data: summaries } = useQuery({
    queryKey: ['summaries'],
    queryFn: getSummary,
  });

  const handleLogout = () => {
    onClose();
    signOut({ callbackUrl: '/' });
  };

  const handleNavigateToSummary = (id: string) => {
    onClose();
    router.push(`/result/${id}`);
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteSummary,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
      showToast('삭제되었습니다.', 'success');
    },
  });

  const { targetRef } = useOnClickOutside({
    onClickOutside: () => {
      if (!currentId) onClose();
    },
  });

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center'>
      <div
        className='bg-white flex justify-center flex-col px-[20px] py-[30px] rounded-[10px]'
        ref={targetRef}
      >
        <div className='mb-[26px]'>
          <div className='w-full mb-[14px] flex justify-between items-center'>
            <h2 className='font-semibold text-[18px]'>계정 정보</h2>
            <button className='-translate-y-[2px]' onClick={onClose}>
              <XSvg />
            </button>
          </div>

          <div className='flex justify-between items-center w-full'>
            <span>{session?.user.email || session?.user.name}</span>
            <button className='basic-btn' onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>

        <div>
          <h2 className='font-semibold text-[18px] mb-[14px]'>
            저장된 요약 및 채팅
          </h2>

          <div className='flex border-b border-gray-300 mb-[6px] pb-[6px]'>
            <div className='flex-1'>파일명</div>
            <div className='flex-1'>생성일</div>
          </div>

          <ul className='flex flex-col gap-[6px]'>
            {summaries &&
              summaries.data
                .filter((item) => item.isSaved)
                .map((data) => (
                  <li key={data.id} className='flex'>
                    <div className='flex-1 text-blue-600'>
                      <button
                        onClick={() => handleNavigateToSummary(data.id)}
                        className='text-left'
                      >
                        {data.fileName}
                      </button>
                    </div>

                    <div className='flex flex-1 justify-between items-center'>
                      <div>{formatDate(data.createdAt, 'YY년 MM월 DD일')}</div>
                      <button
                        className='mr-[10px] text-red-500'
                        onClick={() => {
                          setCurrentId(data.id);
                        }}
                      >
                        삭제
                      </button>
                    </div>

                    {currentId === data.id && (
                      <DeleteModal
                        isOpen={true}
                        fileName={data.fileName}
                        onClose={() => {
                          setCurrentId(null);
                        }}
                        onDelete={() => {
                          deleteMutate(data.id);
                          setCurrentId(null);
                        }}
                      />
                    )}
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
}
