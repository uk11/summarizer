import { createPortal } from 'react-dom';
import XSvg from '@/components/svg-components/XSvg';
import { signIn } from 'next-auth/react';
import { useOnClickOutside } from '@/hooks/useOutsideClick';
import KakaoIconSvg from '@/components/svg-components/KakaoIconSvg';
import GoogleIconSvg from '@/components/svg-components/GoogleIconSvg';
import LoginLogoSvg from '@/components/svg-components/LoginLogoSvg';
import clsx from 'clsx';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: Props) {
  const { targetRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center'>
      <div
        className={clsx(
          'w-[370px] bg-white flex justify-center items-center flex-col px-[20px] py-[20px] rounded-[10px]',
          'max-md:w-[100%] max-md:mx-[16px]'
        )}
        ref={targetRef}
      >
        <div className='relative w-full'>
          <h1 className='flex justify-center font-semibold my-[30px]'>
            <LoginLogoSvg />
          </h1>

          <button onClick={onClose} className='absolute right-0 top-0'>
            <XSvg />
          </button>
        </div>

        <p className='text-lg font-medium text-[#555555]'>
          로그인하고 채팅을 저장해보세요!
        </p>

        <div className='flex flex-col gap-[8px] w-full my-[70px]'>
          <button
            className='border border-gray-300 px-[10px] py-[10px] rounded-[10px] flex hover:bg-gray-100 hover:border-gray-100'
            onClick={() => signIn('google')}
          >
            <GoogleIconSvg />

            <p className='flex justify-center w-full text-primary'>
              Google 계정으로 시작하기
            </p>
          </button>

          <button
            className='bg-[#FFE34E] border border-[#FFE34E] px-[10px] py-[10px] rounded-[10px] flex hover:bg-[#F6D739]'
            onClick={() => signIn('kakao')}
          >
            <KakaoIconSvg />

            <p className='flex justify-center w-full text-primary'>
              Kakao 계정으로 시작하기
            </p>
          </button>
        </div>

        <button
          className='text-[#555555] text-[14px] cursor-pointer hover:text-[#333333] hover:scale-102'
          onClick={onClose}
        >
          비로그인으로 계속하기
        </button>
      </div>
    </div>,
    document.body
  );
}
