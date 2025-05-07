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

  const { data: messages } = useQuery({
    queryKey: ['summuryChat', summaryId],
    queryFn: () => getChatMessages(summaryId),
    select: (messages) =>
      [
        {
          id: 'default',
          role: 'assistant',
          content: '안녕하세요! 요약에 대해 무엇이든 질문하세요.',
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
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      className='flex flex-col border p-[10px] flex-[6] overflow-y-auto scrollbar-stable'
      ref={scrollRef}
    >
      <div>asd</div>
      <div className='flex-1'>
        {messages &&
          messages.map((msg) => (
            <div
              key={msg.id}
              ref={(el) => {
                if (msg === messages[messages.length - 1]) {
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
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

      <div className='flex items-center gap-[8px] pl-[10px] mt-[8px]'>
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
