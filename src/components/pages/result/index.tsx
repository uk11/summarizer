import { Summary } from '@prisma/client';
import SummaryResult from './SummaryResult';
import SummaryChat from './SummaryChat';

type Props = {
  summary: Summary;
};

export default function ResultClient({ summary }: Props) {
  return (
    <div className='p-[16px] flex gap-[10px] h-[calc(100vh-60px)]'>
      <SummaryResult summary={summary} />
      <SummaryChat summaryId={summary.id} />
    </div>
  );
}
