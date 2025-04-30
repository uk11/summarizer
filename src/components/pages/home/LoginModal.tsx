import { createPortal } from 'react-dom';
import XSvg from '@/components/svg-components/XSvg';
import { signIn } from 'next-auth/react';

type Props = {
  isLoginModalOpen: boolean;
  handleLoginModalClick: () => void;
};

export default function LoginModal({
  isLoginModalOpen,
  handleLoginModalClick,
}: Props) {
  if (!isLoginModalOpen) return null;

  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center'>
      <div className='w-[400px] bg-white flex justify-center items-center flex-col px-[20px] py-[30px] rounded-[10px]'>
        <div className='relative w-full pb-[20px]'>
          <h1 className='text-center text-lg font-semibold'>로그인</h1>
          <button
            onClick={handleLoginModalClick}
            className='absolute right-0 top-0 cursor-pointer'
          >
            <XSvg />
          </button>
        </div>

        <button
          className='w-full border px-[10px] py-[8px] rounded-[10px] cursor-pointer'
          onClick={() => signIn('google')}
        >
          Google 계정으로 계속하기
        </button>

        <button
          className='w-full border px-[10px] py-[8px] rounded-[10px] cursor-pointer'
          onClick={() => signIn('kakao')}
        >
          Kakao 계정으로 계속하기
        </button>
      </div>
    </div>,
    document.body
  );
}
