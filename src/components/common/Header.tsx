'use client';

import Link from 'next/link';
import LoginModal from '../pages/home/LoginModal';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import LogoutModal from '../pages/home/LogoutModal';
import { RiMenu3Fill } from 'react-icons/ri';
import { useAtom } from 'jotai';
import { isSidebarOpenAtom } from '@/store';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const { data: session, status } = useSession();

  const handleLoginModalClick = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleLogoutModalClick = () => {
    setIsLogoutModalOpen(!isLogoutModalOpen);
  };

  return (
    <header className='h-[60px] flex items-center justify-between px-5 border-b bg-white sticky top-0'>
      <div className='flex gap-[16px]'>
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <RiMenu3Fill className='w-[20px] h-[20px]' />
          </button>
        )}
        <Link href='/' className='text-[20px] font-bold text-gray-800'>
          Summarizer
        </Link>
      </div>

      {status === 'loading' ? (
        <div className='w-[30px] h-[30px] rounded-full bg-gray-200 animate-pulse' />
      ) : status === 'authenticated' ? (
        <Image
          src={session.user.image!}
          alt='프로필 이미지'
          width={30}
          height={30}
          onClick={handleLogoutModalClick}
          className='rounded-full cursor-pointer'
        />
      ) : (
        <button
          className='rounded px-3 py-1 border text-gray-600 hover:bg-gray-100 cursor-pointer'
          onClick={handleLoginModalClick}
        >
          로그인
        </button>
      )}

      {isLoginModalOpen && (
        <LoginModal
          isLoginModalOpen={isLoginModalOpen}
          handleLoginModalClick={handleLoginModalClick}
        />
      )}

      {isLogoutModalOpen && (
        <LogoutModal
          isLogoutModalOpen={isLogoutModalOpen}
          handleLogoutModalClick={handleLogoutModalClick}
        />
      )}
    </header>
  );
}
