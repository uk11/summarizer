'use client';

import { getChatMessages, postChatMessage } from '@/fetch';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

type Props = {
  summaryId: string;
};

export default function SummaryChat({ summaryId }: Props) {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [questionInput, setQuestionInput] = useState('');
  const prevLength = useRef<number | null>(null);

  const { data: messages } = useQuery({
    queryKey: ['summuryChat', summaryId],
    queryFn: () => getChatMessages(summaryId),
    select: (messages) =>
      [
        {
          id: 'default',
          role: 'assistant',
          content: '안녕하세요! 요약을 읽고 궁금한 점이 있다면 알려주세요',
        },
        ...messages,
      ] as { id: string; role: 'user' | 'assistant'; content: string }[],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      summaryId,
      question,
    }: {
      summaryId: string;
      question: string;
    }) => postChatMessage(summaryId, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summuryChat', summaryId] });
    },
  });

  useEffect(() => {
    if (!scrollRef.current || !messages) return;

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: prevLength.current === null ? 'auto' : 'smooth',
    });

    prevLength.current = messages.length;
  }, [messages]);

  return (
    <div className='flex flex-col flex-[6] p-[10px] pr-0 pt-0 border'>
      <div
        className='flex-1 overflow-y-auto scrollbar-stable pr-[6px] pt-[10px]'
        ref={scrollRef}
      >
        <div className='text-[20px] font-semibold mb-[8px]'>채팅</div>
        {messages &&
          messages.map((msg) => (
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

      <div className='flex items-center gap-[8px] mt-[8px] pr-[10px]'>
        <input
          type='text'
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setQuestionInput('');
              mutate({ summaryId, question: questionInput });
            }
          }}
          className='flex-1 border rounded p-[8px]'
          placeholder='무엇이든 물어보세요.'
        />
        <button
          onClick={() => {
            setQuestionInput('');
            mutate({ summaryId, question: questionInput });
          }}
          className='bg-black text-white rounded px-4 py-2 disabled:opacity-50'
          disabled={isPending}
        >
          전송
        </button>
      </div>
    </div>
  );
}
