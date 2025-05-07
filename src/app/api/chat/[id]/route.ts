import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: Props) {
  const { id: summaryId } = await params;

  if (!summaryId) {
    return NextResponse.json(
      { error: 'summaryId가 누락되었습니다.' },
      { status: 400 }
    );
  }

  const messages = await db.chatMessage.findMany({
    where: { summaryId },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ messages });
}
