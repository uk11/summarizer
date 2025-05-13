'use client';

import clsx from 'clsx';
import { getChatMessages, postChatMessage, updateSummarySaved } from '@/fetch';
import { Summary } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  summary: Summary;
};

export default function SummaryChat({ summary }: Props) {
  const [questionInput, setQuestionInput] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLength = useRef<number | null>(null);

  const { data: chatMessages } = useQuery({
    queryKey: ['summaryChat', summary.id],
    queryFn: () => getChatMessages(summary.id),
    select: (chatMessages) =>
      [
        {
          id: 'default',
          role: 'assistant',
          content: '안녕하세요! 요약을 읽고 궁금한 점이 있다면 알려주세요',
        },
        ...chatMessages,
      ] as { id: string; role: 'user' | 'assistant'; content: string }[],
  });

  const { mutate: postMutate, isPending } = useMutation({
    mutationFn: ({
      summaryId,
      question,
    }: {
      summaryId: string;
      question: string;
    }) => postChatMessage(summaryId, question),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summaryChat', summary.id] });
    },
  });

  const { mutate: cancleSaveMutate } = useMutation({
    mutationFn: ({
      summaryId,
      isSaved,
    }: {
      summaryId: string;
      isSaved: boolean;
    }) => updateSummarySaved(summaryId, isSaved),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
      router.refresh();
    },
  });

  useEffect(() => {
    if (!scrollRef.current || !chatMessages) return;

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: prevLength.current === null ? 'auto' : 'smooth',
    });

    prevLength.current = chatMessages.length;
  }, [chatMessages]);

  const handleSubmitQuestion = () => {
    if (!questionInput.trim()) return;
    setQuestionInput('');
    postMutate({ summaryId: summary.id, question: questionInput });
  };

  return (
    <div className='flex flex-col flex-[6] p-[10px] pr-0 pt-0 border'>
      <div
        className='flex-1 overflow-y-auto scrollbar-stable pr-[6px] pt-[10px]'
        ref={scrollRef}
      >
        <div className='text-[20px] font-semibold mb-[8px]'>채팅</div>
        {chatMessages &&
          chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                'px-[8px] py-[6px] mb-[10px] rounded max-w-[80%] w-fit break-words whitespace-pre-wrap',
                msg.role === 'user' ? 'bg-gray-100 ml-auto' : 'mr-auto'
              )}
            >
              {msg.content}
            </div>
          ))}

        {isPending && (
          <div className='text-gray-400 pl-[8px] px-[8px] py-[6px] mb-[10px]'>
            답변 작성 중...
          </div>
        )}
      </div>

      {summary.isSaved ? (
        <div className='flex items-center justify-center gap-[10px]'>
          <div>채팅을 이어서 하려면 저장을 취소하세요.</div>
          <button
            className='basic-btn'
            onClick={() =>
              cancleSaveMutate({
                summaryId: summary.id,
                isSaved: summary.isSaved,
              })
            }
          >
            저장 취소하기
          </button>
        </div>
      ) : (
        <div className='flex items-center gap-[8px] mt-[8px] pr-[10px]'>
          <input
            type='text'
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuestion()}
            className='flex-1 border rounded p-[8px]'
            placeholder='무엇이든 물어보세요.'
          />
          <button
            onClick={handleSubmitQuestion}
            className='bg-black text-white rounded px-4 py-2 disabled:opacity-50'
            disabled={isPending}
          >
            전송
          </button>
        </div>
      )}
    </div>
  );
}
