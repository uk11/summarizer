'use client';

import { useAtom } from 'jotai';
import { isSidebarOpenAtom } from '@/store';
import { RiMenu3Fill } from 'react-icons/ri';
import clsx from 'clsx';
import { Summary } from '@prisma/client';
import Link from 'next/link';

type Props = {
  summaries: Summary[];
};

export default function Sidebar({ summaries }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  return (
    <div
      className={clsx(
        'transition-all duration-300 bg-gray-100 overflow-hidden',
        isSidebarOpen ? 'w-[260px]' : 'w-0'
      )}
    >
      <div className='h-[60px] px-[20px] flex items-center'>
        <button onClick={() => setIsSidebarOpen(false)}>
          <RiMenu3Fill className='w-[20px] h-[20px]' />
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
