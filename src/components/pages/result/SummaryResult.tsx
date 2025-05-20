import { Summary } from '@prisma/client';

type Props = {
  summary: Summary;
};

export default function SummaryResult({ summary }: Props) {
  return (
    <div className='border p-[16px] md:flex-[4] md:overflow-y-auto border-gray-300 shadow-gray-300 shadow-sm rounded-[8px]'>
      <div className='text-[20px] font-semibold mb-[8px] break-all text-black'>
        {summary.fileName}
      </div>
      <div>{summary.content}</div>
    </div>
  );
}
