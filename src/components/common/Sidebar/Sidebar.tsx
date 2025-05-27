'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { isSidebarOpenAtom } from '@/store';
import { Summary } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { RiStickyNoteAddLine } from 'react-icons/ri';
import { RiMenu3Fill } from 'react-icons/ri';
import { RiMoreFill } from 'react-icons/ri';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSummaryFileName } from '@/fetch';
import SummaryDropdown from './SummaryDropdown';
import { useMediaQuery } from 'react-responsive';
import { useOnClickOutside } from '@/hooks/useOutsideClick';
import { useSummaries } from '@/hooks/query/useSummaries';

export default function Sidebar() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [editedFileName, setEditedFileName] = useState('');

  const { data: summaries } = useSummaries(false);

  const { targetRef } = useOnClickOutside({
    onClickOutside: () => {
      if (!currentId && isMobile) setIsSidebarOpen(false);
    },
  });

  const { mutate } = useMutation({
    mutationFn: (data: { id: string; fileName: string }) =>
      updateSummaryFileName(data.id, data.fileName),

    onMutate: async (newSummary) => {
      await queryClient.cancelQueries({ queryKey: ['summaries'] });

      const prevSummary = queryClient.getQueryData<{ data: Summary[] }>([
        'summaries',
      ]);

      queryClient.setQueryData<{ data: Summary[] }>(
        ['summaries'],
        (currentSummaries) => {
          return (
            currentSummaries && {
              data: currentSummaries.data.map((summary) =>
                summary.id === newSummary.id
                  ? { ...summary, fileName: newSummary.fileName }
                  : summary
              ),
            }
          );
        }
      );

      return { prevSummary };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
      router.refresh();
    },

    onError: (err, _variables, ctx) => {
      console.error(err);
      queryClient.setQueryData(['summaries'], ctx?.prevSummary);
    },
  });

  useEffect(() => {
    if (!isMobile) setIsSidebarOpen(true);
  }, [isMobile, setIsSidebarOpen]);

  return (
    <div
      className={clsx(
        'fixed h-screen overflow-hidden bg-[#f8f8f8] duration-600 z-[10]',
        'dark:bg-dark-200 dark:text-white-100',
        isSidebarOpen ? 'w-[260px] max-md:w-[75vw]' : 'w-0'
      )}
      ref={targetRef}
    >
      <div className='w-[260px] flex flex-col h-screen max-md:w-[75vw]'>
        <div className='h-[60px] flex items-center justify-between pl-[12px] pr-[16px] '>
          <button
            className='p-[4px] hover:bg-gray-200 hover:rounded-[6px] hover:dark:bg-dark-400'
            onClick={() => setIsSidebarOpen(false)}
          >
            <RiMenu3Fill className='w-[24px] h-[24px] cursor-pointer' />
          </button>

          {summaries?.data.length !== 0 && (
            <button
              className='p-[4px] hover:bg-gray-200 hover:rounded-[6px] hover:dark:bg-dark-400'
              onClick={() => {
                if (isMobile) {
                  setIsSidebarOpen(false);
                }
                router.push('/');
              }}
            >
              <RiStickyNoteAddLine className='w-[24px] h-[24px] cursor-pointer' />
            </button>
          )}
        </div>

        {summaries?.data.length === 0 && (
          <button
            className={clsx(
              'flex mx-[12px] px-[8px] py-[10px] rounded-[8px] hover:bg-gray-300',
              'dark:bg-inherit hover:dark:bg-dark-400'
            )}
            onClick={() => {
              if (isMobile) {
                setIsSidebarOpen(false);
              }
              router.push('/');
            }}
          >
            새 요약을 생성해 보세요!
          </button>
        )}

        <div className='pl-[12px] pr-[6px] max-md:pr-[8px] flex-1 overflow-y-auto pb-[20px] scrollbar-stable'>
          <ul className='flex flex-col gap-[1px]'>
            {summaries &&
              summaries.data.map((data) => (
                <li key={data.id}>
                  <div
                    className={clsx(
                      'px-[8px] flex justify-between items-center rounded-[8px] whitespace-nowrap gap-[6px]',
                      'hover:bg-gray-200 hover:dark:bg-dark-400 hover:rounded-[8px]',
                      params.id === data.id &&
                        'bg-gray-300 dark:bg-dark-600 rounded-[8px]',
                      currentId === data.id && 'bg-gray-200 dark:bg-dark-400'
                    )}
                  >
                    {isEditingId === data.id ? (
                      <input
                        className='py-[10px] pl-[10px] pr-[16px] mx-[-8px] rounded-[8px] focus:outline-none bg-gray-200 dark:bg-dark-400 max-md:w-[110%] max-md:mr-[-14px]'
                        value={editedFileName}
                        onChange={(e) => setEditedFileName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingId(null);
                            mutate({
                              id: data.id,
                              fileName: editedFileName,
                            });
                            setEditedFileName('');
                          }
                        }}
                        onBlur={() => {
                          setIsEditingId(null);
                          mutate({ id: data.id, fileName: editedFileName });
                          setEditedFileName('');
                        }}
                        autoFocus
                      />
                    ) : (
                      <Link
                        className='w-full py-[10px] overflow-hidden font-semibold'
                        href={`/result/${data.id}`}
                        onClick={() =>
                          isMobile && setIsSidebarOpen(!isSidebarOpen)
                        }
                      >
                        {data.fileName}
                      </Link>
                    )}

                    <div className='relative'>
                      <button
                        className='flex items-center'
                        onClick={() =>
                          setCurrentId(currentId === data.id ? null : data.id)
                        }
                        ref={(el) => {
                          btnRefs.current[data.id] = el;
                        }}
                      >
                        <RiMoreFill
                          className={clsx(
                            'w-[24px] h-[24px] my-[8px] hover:text-gray-900 hover:dark:text-white hover:scale-110',
                            isEditingId === data.id && 'hidden'
                          )}
                        />
                      </button>

                      {currentId === data.id && (
                        <SummaryDropdown
                          fileName={data.fileName}
                          isSaved={data.isSaved}
                          currentId={currentId}
                          btnRef={{ current: btnRefs.current[data.id] }}
                          setCurrentId={setCurrentId}
                          onEdit={() => {
                            setIsEditingId(data.id);
                            setEditedFileName(data.fileName);
                            setCurrentId(null);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
