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
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSummary, updateSummaryFileName } from '@/fetch';
import SummaryDropdown from './SummaryDropdown';

export default function Sidebar() {
  const params = useParams();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [editedFileName, setEditedFileName] = useState('');
  const queryClient = useQueryClient();
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const { data: summaries } = useQuery({
    queryKey: ['summaries'],
    queryFn: getSummary,
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

  return (
    <div
      className={clsx(
        'fixed h-screen overflow-hidden bg-gray-100 duration-600',
        isSidebarOpen ? 'w-[260px]' : 'w-0'
      )}
    >
      <div className='w-[260px] flex flex-col h-screen'>
        <div className='h-[60px] flex items-center justify-between px-[16px]'>
          <button
            className='p-[4px] hover:bg-gray-200 hover:rounded-[6px]'
            onClick={() => setIsSidebarOpen(false)}
          >
            <RiMenu3Fill className='w-[24px] h-[24px] cursor-pointer' />
          </button>

          <button
            className='p-[4px] hover:bg-gray-200 hover:rounded-[6px]'
            onClick={() => router.push('/')}
          >
            <RiStickyNoteAddLine className='w-[24px] h-[24px] cursor-pointer' />
          </button>
        </div>

        <div className='pl-[12px] pr-[10px] flex-1 overflow-y-auto pb-[20px]'>
          <ul>
            {summaries &&
              summaries.data
                .filter((item) => !item.isSaved)
                .map((data) => (
                  <li key={data.id}>
                    <div
                      className={clsx(
                        'px-[8px] flex justify-between items-center hover:bg-gray-200 hover:rounded-[8px] whitespace-nowrap',
                        params.id === data.id && 'bg-gray-300 rounded-[8px]'
                      )}
                    >
                      {isEditingId === data.id ? (
                        <input
                          value={editedFileName}
                          onChange={(e) => setEditedFileName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setIsEditingId(null);
                              mutate({ id: data.id, fileName: editedFileName });
                            }
                          }}
                          onBlur={() => {
                            setIsEditingId(null);
                            mutate({ id: data.id, fileName: editedFileName });
                          }}
                          autoFocus
                          className='w-full py-[8px] text-sm bg-white rounded px-4'
                        />
                      ) : (
                        <Link
                          className='w-full py-[8px] overflow-hidden'
                          href={`/result/${data.id}`}
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
                          <RiMoreFill className='w-[24px] h-[24px] my-[8px] text-gray-600 hover:text-gray-900 hover:scale-110' />
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
