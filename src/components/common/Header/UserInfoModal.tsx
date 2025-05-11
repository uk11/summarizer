import { createPortal } from 'react-dom';
import XSvg from '@/components/svg-components/XSvg';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useOnClickOutside } from '@/hooks/useOutsideClick';
import { useQuery } from '@tanstack/react-query';
import { getSummaryAndChat } from '@/fetch';
import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/day';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserInfoModal({ isOpen, onClose }: Props) {
  const params = useParams();
  const summaryId = params.id as string;
  const { data: session } = useSession();

  const { data: summaryAndChatData } = useQuery({
    queryKey: ['SummaryAndChat', summaryId],
    queryFn: () => getSummaryAndChat(summaryId),
  });

  const handleLogout = () => {
    onClose();
    signOut({ callbackUrl: '/' });
  };

  const { targetRef } = useOnClickOutside({
    onClickOutside: onClose,
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
            <h1 className='font-semibold text-[18px]'>계정 정보</h1>
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
          <div className='font-semibold text-[18px] mb-[14px]'>
            저장된 요약 및 채팅
          </div>
          <div className='flex w-[500px] border-b border-gray-300'>
            <div className='flex-1'>파일명</div>
            <div className='flex-1'>생성일</div>
          </div>
          {summaryAndChatData &&
            summaryAndChatData.data.map((data) => (
              <div key={data.id} className='flex'>
                <div className='flex-1'>{data.fileName}</div>
                <div className='flex-1'>
                  {formatDate(data.createdAt, 'YY년 MM월 DD일')}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
