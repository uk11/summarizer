'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAtom } from 'jotai';
import { isSidebarOpenAtom } from '@/store';
import { useTheme } from 'next-themes';
import { RiMenu3Fill } from 'react-icons/ri';
import clsx from 'clsx';
import Image from 'next/image';
import UserInfoModal from './UserInfoModal';
import LoginModal from './LoginModal';
import DarkmodeButton from './DarkmodeButton';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  const handleLoginModalClick = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleUserInfoModalClick = () => {
    setIsUserInfoModalOpen(!isUserInfoModalOpen);
  };

  return (
    <header
      className={clsx(
        'h-[60px] flex items-center justify-between px-[16px] border-b border-blue-100 shadow-2xs shadow-blue-100',
        'max-md:px-[12px] dark:border-blue-300 dark:shadow-none'
      )}
    >
      <div className='flex gap-[10px] max-md:gap-[6px]'>
        {!isSidebarOpen && (
          <button
            className='p-1 hover:bg-gray-200 hover:dark:bg-dark-500 hover:rounded-[6px]'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <RiMenu3Fill className='w-[24px] h-[24px]' />
          </button>
        )}
        <Link
          href='/'
          className={clsx(
            'text-[24px] font-semibold',
            isSidebarOpen && 'max-md:ml-[38px]'
          )}
        >
          Summarizer
        </Link>
      </div>

      <div className='flex items-center gap-[20px] max-md:gap-[14px]'>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <DarkmodeButton />
        </button>

        {status === 'loading' ? (
          <div className='w-[34px] h-[34px] rounded-full bg-gray-200 animate-pulse mr-[4px]' />
        ) : status === 'authenticated' ? (
          <Image
            src={session.user.image!}
            alt='프로필 이미지'
            width={36}
            height={36}
            onClick={handleUserInfoModalClick}
            className='rounded-full cursor-pointer mr-[4px]'
          />
        ) : (
          <button
            className='blue-btn py-[5px] mr-[4px] max-md:mr-0'
            onClick={handleLoginModalClick}
          >
            로그인
          </button>
        )}
      </div>

      {isLoginModalOpen && (
        <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClick} />
      )}

      {isUserInfoModalOpen && (
        <UserInfoModal
          isOpen={isUserInfoModalOpen}
          onClose={handleUserInfoModalClick}
        />
      )}
    </header>
  );
}
