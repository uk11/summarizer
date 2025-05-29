import Upload from './Upload';
import { RiErrorWarningLine } from 'react-icons/ri';

export default function HomeClient() {
  return (
    <div className='flex flex-col items-center max-md:px-[16px]'>
      <div className='flex flex-col items-center mt-[100px] max-md:mt-[70px]'>
        <h2 className='text-4xl font-bold mb-[30px]'>AI 요약 도구</h2>

        <p className='text-2xl max-md:text-xl mb-[50px]'>
          파일을 업로드하면 AI가 대신 요약해주고{' '}
          <span className='max-md:block'>
            채팅을 통해 빠르게 이해할 수 있습니다.
          </span>
        </p>
      </div>

      <Upload />

      <div className='flex gap-[4px] mt-[20px] text-gray-400 dark:text-white-100 md:w-[800px]'>
        <RiErrorWarningLine className='shrink-0 mt-[2px]' />

        <p className='text-[14px]'>
          현재 gpt-3.5-turbo 모델을 사용하고 있기 때문에 요약 및 답변 내용이
          부정확할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
