import Link from 'next/link';

export default function Header() {
  return (
    <header className='h-[60px] flex items-center justify-between px-5 border-b shadow-sm bg-white sticky top-0 z-50'>
      <Link href='/' className='text-[20px] font-bold text-gray-800'>
        🧠 Summarizer
      </Link>

      <div className='flex items-center gap-4 text-sm text-gray-600'>
        <Link href='/result-history' className='hover:text-black'>
          요약 내역
        </Link>

        <Link
          href='/test'
          className='rounded px-3 py-1 border text-gray-600 hover:bg-gray-100'
        >
          로그인
        </Link>
      </div>
    </header>
  );
}
