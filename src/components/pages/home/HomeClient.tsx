import Dropzone from './DropZone';

export default function HomeClient() {
  return (
    <div className='flex flex-col justify-center items-center'>
      <p>파일 요약 도구</p>
      <Dropzone />
    </div>
  );
}
