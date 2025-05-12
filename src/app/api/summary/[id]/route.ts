import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fileName } = body;

    await db.summary.update({
      where: { id },
      data: { fileName },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error('PATCH /summary/[id] Error:', err);
    const errorMessage = (err as Error).message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    await db.summary.delete({ where: { id } });

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error('DELETE /summary/[id] Error:', err);
    const errorMessage = (err as Error).message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
