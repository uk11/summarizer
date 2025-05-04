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
import { useState } from 'react';
import SummaryDropdown from './SummaryDropdown';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSummary, updateSummary } from '@/fetch';

export default function Sidebar() {
  const params = useParams();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [editedFileName, setEditedFileName] = useState('');
  const queryClient = useQueryClient();

  const { data: summaries } = useQuery({
    queryKey: ['summaries'],
    queryFn: getSummary,
  });

  const { mutate } = useMutation({
    mutationFn: (data: { id: string; fileName: string }) =>
      updateSummary(data.id, data.fileName),
    onMutate: async (newSummary) => {
      await queryClient.cancelQueries({ queryKey: ['summaries'] });

      const prevSummary = queryClient.getQueryData<Summary[]>(['summaries']);

      queryClient.setQueryData<Summary[]>(['summaries'], (currentSummaries) =>
        currentSummaries?.map((summary) =>
          summary.id === newSummary.id
            ? { ...summary, fileName: newSummary.fileName }
            : summary
        )
      );

      return { prevSummary };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
    onError: (_err, _variables, ctx) => {
      queryClient.setQueryData(['summaries'], ctx?.prevSummary);
    },
  });

  return (
    <div
      className={clsx(
        'transition-width duration-600 bg-gray-100 overflow-hidden',
        isSidebarOpen ? 'w-[260px]' : 'w-0'
      )}
    >
      <div className='w-[260px]'>
        <div className='h-[60px] flex items-center justify-between px-[16px]'>
          <button
            className='p-1 hover:bg-gray-200 hover:rounded-[6px]'
            onClick={() => setIsSidebarOpen(false)}
          >
            <RiMenu3Fill className='w-[24px] h-[24px] cursor-pointer' />
          </button>

          <button
            className='p-1 hover:bg-gray-200 hover:rounded-[6px]'
            onClick={() => router.push('/')}
          >
            <RiStickyNoteAddLine className='w-[24px] h-[24px] cursor-pointer' />
          </button>
        </div>

        <div className='px-[12px]'>
          <ul className='flex flex-col gap-[0px]'>
            {summaries &&
              summaries.map((data) => (
                <li key={data.id}>
                  <div
                    className={clsx(
                      'px-[8px] flex justify-between items-center hover:bg-gray-200 hover:rounded-[8px]',
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
                        className='w-full py-[8px] text-sm bg-white rounded px-2'
                      />
                    ) : (
                      <Link
                        className='w-full py-[8px]'
                        href={`/result/${data.id}`}
                      >
                        {data.fileName}
                      </Link>
                    )}

                    <div className='relative'>
                      <button
                        className='cursor-pointer flex items-center'
                        onClick={() =>
                          setCurrentId(currentId === data.id ? null : data.id)
                        }
                      >
                        <RiMoreFill className='w-[24px] h-[24px] my-[8px]' />
                      </button>

                      {currentId === data.id && (
                        <SummaryDropdown
                          currentId={currentId}
                          setCurrentId={setCurrentId}
                          fileName={data.fileName}
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
