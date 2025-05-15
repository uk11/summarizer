'use client';

import { Summary } from '@prisma/client';
import SummaryResult from './SummaryResult';
import SummaryChat from './SummaryChat';
import { getChatMessages } from '@/fetch';
import { useQuery } from '@tanstack/react-query';
import useBottomScroll from '@/hooks/useBottomScroll';

type Props = {
  summary: Summary;
};

export default function ResultClient({ summary }: Props) {
  const { data: chatMessages } = useQuery({
    queryKey: ['summaryChat', summary.id],
    queryFn: () => getChatMessages(summary.id),
  });

  const { scrollRef } = useBottomScroll(chatMessages!);

  return (
    <div
      className='p-[16px] flex gap-[10px] h-[calc(100vh-60px)] text-primary max-md:flex-col overflow-y-auto'
      ref={scrollRef}
    >
      <SummaryResult summary={summary} />
      <SummaryChat summary={summary} />
    </div>
  );
}
