import clsx from 'clsx';
import { RiMoonClearFill } from 'react-icons/ri';
import { RiSunLine } from 'react-icons/ri';

export default function DarkmodeButton() {
  return (
    <div
      className={clsx(
        'flex items-center justify-center w-[40px] h-[40px] bg-white text-dark-500 rounded-[6px] border-2 border-gray-200',
        'dark:bg-dark-300 dark:border-none dark:text-white'
      )}
    >
      <RiMoonClearFill className='w-[24px] h-[24px] dark:hidden' />
      <RiSunLine className='w-[24px] h-[24px] hidden dark:block ' />
    </div>
  );
}
