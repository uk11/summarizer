'use client';

import { Summary } from '@prisma/client';
import SummaryResult from './SummaryResult';
import SummaryChat from './SummaryChat';
import { getChatMessages } from '@/fetch';
import { useQuery } from '@tanstack/react-query';
import useBottomScroll from '@/hooks/useBottomScroll';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { useEffect } from 'react';

type Props = {
  summary: Summary;
};

export default function ResultClient({ summary }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: session, status } = useSession();
  const isAccess =
    status === 'authenticated' &&
    summary.userId &&
    session?.user?.id !== summary.userId;

  const { data: chatMessages } = useQuery({
    queryKey: ['summaryChat', summary.id],
    queryFn: () => getChatMessages(summary.id),
  });

  const { scrollRef } = useBottomScroll(chatMessages!);

  useEffect(() => {
    if (isAccess) {
      router.replace('/');
      showToast('권한이 없습니다.', 'error');
    }
  }, [isAccess, showToast, router]);

  if (isAccess) return null;

  return (
    <div
      className='p-[16px] pr-[12px] flex gap-[10px] h-[calc(100vh-60px)] text-primary max-md:flex-col overflow-y-auto scrollbar-stable'
      ref={scrollRef}
    >
      <SummaryResult summary={summary} />
      <SummaryChat summary={summary} />
    </div>
  );
}
