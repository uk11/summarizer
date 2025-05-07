import { Summary } from '@prisma/client';

type Props = {
  summary: Summary;
};

export default function SummaryResult({ summary }: Props) {
  return (
    <div className='border flex-[4] p-[10px] overflow-y-auto'>
      <div>{summary.fileName}</div>
      <div>{summary.content}</div>
    </div>
  );
}
