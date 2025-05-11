'use client';

import Link from 'next/link';
import LoginModal from './LoginModal';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import UserInfoModal from './UserInfoModal';
import { RiMenu3Fill } from 'react-icons/ri';
import { useAtom } from 'jotai';
import { isSidebarOpenAtom } from '@/store';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const { data: session, status } = useSession();

  const handleLoginModalClick = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleUserInfoModalClick = () => {
    setIsUserInfoModalOpen(!isUserInfoModalOpen);
  };

  return (
    <header className='h-[60px] flex items-center justify-between px-[16px] border-b bg-white sticky top-0'>
      <div className='flex gap-[16px]'>
        {!isSidebarOpen && (
          <button
            className='p-1 hover:bg-gray-200 hover:rounded-[6px]'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <RiMenu3Fill className='w-[24px] h-[24px]' />
          </button>
        )}
        <Link href='/' className='text-[20px] font-bold'>
          Summarizer
        </Link>
      </div>

      {status === 'loading' ? (
        <div className='w-[34px] h-[34px] rounded-full bg-gray-200 animate-pulse mr-[4px]' />
      ) : status === 'authenticated' ? (
        <Image
          src={session.user.image!}
          alt='프로필 이미지'
          width={34}
          height={34}
          onClick={handleUserInfoModalClick}
          className='rounded-full cursor-pointer mr-[4px]'
        />
      ) : (
        <button
          className='rounded px-3 py-1 border text-gray-600 hover:bg-gray-100 cursor-pointer mr-[4px]'
          onClick={handleLoginModalClick}
        >
          로그인
        </button>
      )}

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
