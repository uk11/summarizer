import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { isSaved } = body;

    await db.summary.update({
      where: { id },
      data: { isSaved, updatedAt: new Date() },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error('PATCH /summary/[id]/save Error:', err);
    const errorMessage = (err as Error).message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
