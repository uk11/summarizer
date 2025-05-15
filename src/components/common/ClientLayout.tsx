'use client';

import { useAtomValue } from 'jotai';
import { isSidebarOpenAtom } from '@/store';
import clsx from 'clsx';
import Toast from './Toast/Toast';
import { useToast } from '@/hooks/useToast';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const { toastMessage: message, toastType: type } = useToast();

  return (
    <div
      className={clsx(
        'duration-600 max-md:pl-0',
        isSidebarOpen ? 'pl-[260px]' : 'pl-0'
      )}
    >
      {children}

      {message && <Toast message={message} type={type} />}
    </div>
  );
}
