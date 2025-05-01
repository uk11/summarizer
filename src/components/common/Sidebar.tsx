'use client';

import { useAtom } from 'jotai';
import { isSidebarOpenAtom } from '@/store';
import { RiMenu3Fill } from 'react-icons/ri';
import clsx from 'clsx';
import { Summary } from '@prisma/client';
import Link from 'next/link';
import { RiStickyNoteAddLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

type Props = {
  summaries: Summary[];
};

export default function Sidebar({ summaries }: Props) {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  return (
    <div
      className={clsx(
        'transition-all duration-300 bg-gray-100 overflow-hidden',
        isSidebarOpen ? 'w-[260px]' : 'w-0'
      )}
    >
      <div className='h-[60px] px-[16px] flex items-center justify-between'>
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

      <ul>
        {summaries.map((data) => (
          <li key={data.id}>
            <Link href={`/result/${data.id}`}>{data.fileName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
