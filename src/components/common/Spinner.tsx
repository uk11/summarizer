export default function Spinner() {
  return (
    <div className='fixed inset-0 bg-black/20 flex items-center justify-center'>
      <div className='relative w-[12px] h-[12px] rounded-full mx-auto text-blue-400 animate-animloader'></div>
    </div>
  );
}
