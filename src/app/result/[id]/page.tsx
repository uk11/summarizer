import ResultClient from '@/components/pages/result';
import { db } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ResultPage({ params }: Props) {
  const { id } = await params;

  const summary = await db.summary.findUnique({
    where: { id },
  });

  if (!summary) return null;

  return (
    <div>
      <ResultClient summary={summary} />
    </div>
  );
}
