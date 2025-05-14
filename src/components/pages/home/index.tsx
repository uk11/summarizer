import Dropzone from './DropZone';

export default function HomeClient() {
  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col items-center mt-[60px]'>
        <h2 className='text-4xl font-bold mb-[10px]'>AI 요약 도구</h2>

        <p className='text-2xl'>
          파일을 업로드하면 AI가 대신 요약해주고 채팅을 통해 빠르게 이해할 수
          있습니다.
        </p>
      </div>

      <Dropzone />
    </div>
  );
}
