import { createPortal } from 'react-dom';
import XSvg from '@/components/svg-components/XSvg';
import { signIn } from 'next-auth/react';
import { useOnClickOutside } from '@/hooks/useOutsideClick';
import KakaoIconSvg from '@/components/svg-components/KakaoIconSvg';
import GoogleIconSvg from '@/components/svg-components/GoogleIconSvg';
import clsx from 'clsx';
import NaverIconSvg from '@/components/svg-components/NaverIconSvg';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: Props) {
  const { targetRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  const handleLogin = (social: 'google' | 'kakao' | 'naver') => {
    signIn(social, { callbackUrl: '/' });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center z-[20]'>
      <div
        className={clsx(
          'w-[370px] bg-white flex justify-center items-center flex-col px-[20px] py-[20px] rounded-[10px]',
          'dark-mode dark:shadow-md dark:shadow-black',
          'max-md:w-[100%] max-md:mx-[16px]'
        )}
        ref={targetRef}
      >
        <div className='relative w-full'>
          <h1 className='flex justify-center my-[30px] text-[28px] font-semibold'>
            Summarizer
          </h1>

          <button onClick={onClose} className='absolute right-0 top-0'>
            <XSvg />
          </button>
        </div>

        <p className='text-lg font-medium text-center'>
          간편하게 로그인하고 요약 저장과{' '}
          <span className='block'>업로드 용량을 업그레이드 해보세요!</span>
        </p>

        <div className='flex flex-col gap-[8px] w-full my-[70px] text-black'>
          <button
            className='border border-gray-300 px-[10px] py-[10px] rounded-[10px] flex bg-white hover:bg-gray-100 hover:border-gray-100'
            onClick={() => handleLogin('google')}
          >
            <GoogleIconSvg />

            <p className='flex justify-center w-full text-primary'>
              Google 계정으로 시작하기
            </p>
          </button>

          <button
            className='border border-gray-300 px-[10px] py-[10px] rounded-[10px] flex bg-white hover:bg-gray-100 hover:border-gray-100'
            onClick={() => handleLogin('naver')}
          >
            <NaverIconSvg />

            <p className='flex justify-center w-full text-primary'>
              Naver 계정으로 시작하기
            </p>
          </button>

          <button
            className='bg-[#FFE34E] border border-[#FFE34E] px-[10px] py-[10px] rounded-[10px] flex hover:bg-[#F6D739]'
            onClick={() => handleLogin('kakao')}
          >
            <KakaoIconSvg />

            <p className='flex justify-center w-full text-primary'>
              Kakao 계정으로 시작하기
            </p>
          </button>
        </div>

        <button
          className='text-[14px] hover:text-[#333333] hover:scale-102 hover:dark:text-white'
          onClick={onClose}
        >
          비로그인으로 계속하기
        </button>
      </div>
    </div>,
    document.body
  );
}
