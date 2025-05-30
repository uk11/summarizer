'use client';

import clsx from 'clsx';
import { getChatMessages, postChatMessage, updateSummarySaved } from '@/fetch';
import { Summary } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useBottomScroll from '@/hooks/useBottomScroll';
import { useToast } from '@/hooks/useToast';

type Props = {
  summary: Summary;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function SummaryChat({ summary }: Props) {
  const [questionInput, setQuestionInput] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: chatMessages } = useQuery({
    queryKey: ['summaryChat', summary.id],
    queryFn: () => getChatMessages(summary.id),
    select: (chatMessages) => [
      {
        id: 'default',
        role: 'assistant',
        content: '안녕하세요! 요약을 읽고 궁금한 점이 있다면 알려주세요.',
      },
      ...chatMessages,
    ],
  });

  const { scrollRef } = useBottomScroll(chatMessages!);

  const { mutate: postMutate, isPending } = useMutation({
    mutationFn: ({
      summaryId,
      question,
    }: {
      summaryId: string;
      question: string;
    }) => postChatMessage(summaryId, question),

    onMutate: async ({ summaryId, question }) => {
      await queryClient.cancelQueries({ queryKey: ['summaryChat', summaryId] });

      const previousMessages = queryClient.getQueryData<ChatMessage>([
        'summaryChat',
        summaryId,
      ]);

      const newMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: question,
      };

      queryClient.setQueryData<ChatMessage[]>(
        ['summaryChat', summaryId],
        (prevMessages) =>
          prevMessages ? [...prevMessages, newMessage] : [newMessage]
      );

      return { previousMessages };
    },

    onError: (err, _variables, context) => {
      console.error(err);
      queryClient.setQueryData(
        ['summaryChat', summary.id],
        context?.previousMessages
      );
    },

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

  const handleSubmitQuestion = () => {
    if (!questionInput.trim()) return;
    setQuestionInput('');
    postMutate({ summaryId: summary.id, question: questionInput });
  };

  return (
    <div
      className={clsx(
        'flex flex-col flex-[6] p-[16px] pr-[12px] border border-gray-300 rounded-[8px] md:overflow-y-auto scrollbar-stable',
        'shadow-sm shadow-gray-300'
      )}
      ref={scrollRef}
    >
      <div className='flex-1'>
        <div className='text-[20px] dark:text-white font-bold mb-[2px]'>
          채팅
        </div>

        {chatMessages &&
          chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                'px-[8px] py-[6px] mb-[10px] rounded max-w-[80%] w-fit break-words whitespace-pre-wrap',
                msg.role === 'user'
                  ? 'bg-gray-100 dark:bg-gray-200 text-black ml-auto'
                  : 'mr-auto'
              )}
            >
              {msg.content}
            </div>
          ))}

        {chatMessages &&
          chatMessages[chatMessages.length - 1]?.role === 'user' && (
            <div
              className={clsx(
                'px-[8px] py-[6px] text-gray-400 dark:text-white-100',
                isPending ? 'mb-[60px]' : 'mb-[84px]'
              )}
            >
              {isPending && '답변 작성 중...'}
            </div>
          )}
      </div>

      {summary.isSaved ? (
        <div className='flex items-center justify-center gap-[20px] text-center'>
          <p>
            채팅을 이어서 하려면{' '}
            <span className='max-md:block'>저장을 취소하세요.</span>
          </p>

          <button
            className='basic-btn hover:dark:bg-dark-500'
            onClick={() => {
              cancleSaveMutate({
                summaryId: summary.id,
                isSaved: summary.isSaved,
              });
              showToast('저장이 취소되었습니다.', 'success');
            }}
          >
            저장 취소
          </button>
        </div>
      ) : (
        <div className='flex items-end gap-[8px] mt-[8px]'>
          <textarea
            rows={1}
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuestion()}
            placeholder='무엇이든 물어보세요.'
            className={clsx(
              'flex-1 min-w-0 border rounded-[6px] p-[8px] border-gray-400 placeholder:text-gray-400 bg-white text-black focus:outline-none',
              'max-h-[100px] resize-none shadow-md shadow-gray-200 dark:shadow-none min-h-[42px]'
            )}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = 'auto';
              target.style.overflowY =
                target.scrollHeight > 100 ? 'auto' : 'hidden';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          <button
            className='blue-btn px-[16px] py-[8px] disabled:opacity-50'
            onClick={handleSubmitQuestion}
            disabled={isPending}
          >
            전송
          </button>
        </div>
      )}
    </div>
  );
}
