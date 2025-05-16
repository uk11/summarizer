import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import { RiCloseCircleFill } from 'react-icons/ri';

type Props = {
  message: string;
  type: 'success' | 'error' | null;
};

export const typeIcon = {
  success: <RiCheckboxCircleFill className='w-[20px] h-[20px]' />,
  error: <RiCloseCircleFill className='w-[20px] h-[20px]' />,
};

export default function Toast({ message, type }: Props) {
  return createPortal(
    <div
      className={clsx(
        'fixed top-30 right-20 z-50 px-[10px] py-[10px] rounded-[8px] text-white w-[430px] toast',
        'max-md:left-0 max-md:w-[calc(100%-20px)] max-md:mx-[10px]',
        type === 'success' && 'bg-green-500',
        type === 'error' && 'bg-red-500'
      )}
    >
      <div className='flex items-center gap-[8px]'>
        {type && typeIcon[type]}
        {message}
      </div>
    </div>,
    document.body
  );
}
