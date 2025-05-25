import { Summary } from '@prisma/client';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

type Props = {
  summary: Summary;
};

export default function SummaryResult({ summary }: Props) {
  return (
    <div
      className={clsx(
        'border p-[16px] flex-[4] md:overflow-y-auto border-gray-300 rounded-[8px] whitespace-pre-wrap',
        'shadow-sm shadow-gray-300'
      )}
    >
      <div className='text-[20px] font-bold mb-[8px] break-all dark:text-white'>
        {summary.fileName}
      </div>

      <ReactMarkdown>{summary.content}</ReactMarkdown>
    </div>
  );
}
