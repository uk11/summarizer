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

  const summaryAndChat = await db.saveSummaryAndChat.findMany({
    where: { summaryId },
    orderBy: { createdAt: 'asc' },
  });

  if (!summaryAndChat.length) {
    return NextResponse.json(
      { error: '저장된 요약 및 채팅이 없습니다.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: summaryAndChat }, { status: 200 });
}

export async function POST(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const summary = await db.summary.findUnique({
    where: { id },
  });

  const messages = await db.chatMessage.findMany({
    where: { summaryId: id },
  });

  if (!summary) {
    return NextResponse.json(
      { error: '요약을 찾지 못했습니다.' },
      { status: 404 }
    );
  }

  await db.saveSummaryAndChat.create({
    data: {
      summaryId: summary.id,
      fileName: summary.fileName,
      content: summary.content,
      userId: summary.userId!,
      messages: messages,
    },
  });

  return NextResponse.json({}, { status: 201 });
}
