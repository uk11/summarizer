import { Summary } from '@prisma/client';

type Props = {
  summary: Summary;
};

export default function SummaryResult({ summary }: Props) {
  return (
    <div className='border flex-[4] p-[16px] overflow-y-auto border-gray-300 shadow-gray-300 shadow-sm rounded-[8px] bg-white'>
      <div className='text-[20px] font-semibold mb-[8px] break-all text-black'>
        {summary.fileName} 요약
      </div>
      <div>{summary.content}</div>
    </div>
  );
}
