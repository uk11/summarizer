import { createPortal } from 'react-dom';
import XSvg from '@/components/svg-components/XSvg';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useOnClickOutside } from '@/hooks/useOutsideClick';

type Props = {
  isLogoutModalOpen: boolean;
  onClose: () => void;
};

export default function LogoutModal({ isLogoutModalOpen, onClose }: Props) {
  const { data: session } = useSession();

  const handleLogout = () => {
    onClose();
    signOut({ callbackUrl: '/' });
  };

  const { targetRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  if (!isLogoutModalOpen) return null;

  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center'>
      <div
        className='w-[400px] bg-white flex justify-center items-center flex-col px-[20px] py-[30px] rounded-[10px]'
        ref={targetRef}
      >
        <div className='relative w-full pb-[20px]'>
          <h1 className='text-center text-lg font-semibold'>계정 정보</h1>
          <button className='absolute right-0 top-0' onClick={onClose}>
            <XSvg />
          </button>
        </div>
        <div className='flex justify-between w-full'>
          <span>{session?.user.email || session?.user.name}</span>
          <button
            className='rounded px-3 py-1 border text-gray-600 hover:bg-gray-100'
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
