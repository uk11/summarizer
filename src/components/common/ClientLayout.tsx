'use client';

import { useAtomValue } from 'jotai';
import { isSidebarOpenAtom } from '@/store';
import clsx from 'clsx';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);

  return (
    <div
      className={clsx('duration-600', isSidebarOpen ? 'pl-[260px]' : 'pl-0')}
    >
      {children}
    </div>
  );
}
