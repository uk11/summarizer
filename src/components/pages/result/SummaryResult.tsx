import { Summary } from '@prisma/client';

type Props = {
  summary: Summary;
};

export default function SummaryResult({ summary }: Props) {
  return (
    <div className='border flex-[4] p-[10px] overflow-y-auto'>
      <div className='text-[20px] font-semibold mb-[8px] break-all'>
        {summary.fileName} 요약
      </div>
      <div>{summary.content}</div>
    </div>
  );
}
