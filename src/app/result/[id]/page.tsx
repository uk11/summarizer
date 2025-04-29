import { db } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const summary = await db.summary.findUnique({
    where: { id },
  });
  console.log(summary);
  if (!summary) return <div>내용 없음</div>;
  return <div>{summary.content}</div>;
}
