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

type Props = {
  summaries: Summary[];
};

export default function Sidebar({ summaries }: Props) {
  const params = useParams();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [currentId, setCurrentId] = useState<string | null>(null);

  return (
    <div
      className={clsx(
        'transition-all duration-300 bg-gray-100',
        isSidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden'
      )}
    >
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
          {summaries.map((data) => (
            <li key={data.id}>
              <div
                className={clsx(
                  'px-[8px] flex justify-between items-center hover:bg-gray-200 hover:rounded-[8px]',
                  params.id === data.id && 'bg-gray-300 rounded-[8px]'
                )}
              >
                <Link className='w-full py-[8px]' href={`/result/${data.id}`}>
                  {data.fileName}
                </Link>

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
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
