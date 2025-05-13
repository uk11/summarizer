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
        'fixed top-30 right-20 z-50 px-[10px] py-[8px] rounded text-white min-w-[400px] toast',
        type === 'success' && 'bg-green-500',
        type === 'error' && 'bg-red-500'
      )}
    >
      <div className='flex items-center gap-[4px]'>
        {type && typeIcon[type]}
        {message}
      </div>
    </div>,
    document.body
  );
}
