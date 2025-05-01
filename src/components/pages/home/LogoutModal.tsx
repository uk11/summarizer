import { createPortal } from 'react-dom';
import XSvg from '@/components/svg-components/XSvg';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

type Props = {
  isLogoutModalOpen: boolean;
  handleLogoutModalClick: () => void;
};

export default function LogoutModal({
  isLogoutModalOpen,
  handleLogoutModalClick,
}: Props) {
  const { data: session } = useSession();

  const handleLogout = () => {
    handleLogoutModalClick();
    signOut({ callbackUrl: '/' });
  };

  if (!isLogoutModalOpen) return null;

  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center'>
      <div className='w-[400px] bg-white flex justify-center items-center flex-col px-[20px] py-[30px] rounded-[10px]'>
        <div className='relative w-full pb-[20px]'>
          <h1 className='text-center text-lg font-semibold'>계정 정보</h1>
          <button
            className='absolute right-0 top-0 cursor-pointer'
            onClick={handleLogoutModalClick}
          >
            <XSvg />
          </button>
        </div>
        <div className='flex justify-between w-full'>
          <span>{session?.user.email || session?.user.name}</span>
          <button
            className='rounded px-3 py-1 border text-gray-600 hover:bg-gray-100 cursor-pointer'
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
