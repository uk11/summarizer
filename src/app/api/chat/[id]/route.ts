import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id: summaryId } = await params;

    const chatMessages = await db.chatMessage.findMany({
      where: {
        summaryId,
        NOT: { role: 'system' },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ chatMessages }, { status: 200 });
  } catch (err) {
    console.error('GET /chat/[id] Error:', err);
    const errorMessage = (err as Error).message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
