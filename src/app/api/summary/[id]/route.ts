import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params;
  try {
    await db.summary.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '서버 오류가 발생했습니다.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const body = await req.json();
  const { fileName } = body;

  if (!id || !fileName) {
    return NextResponse.json(
      { error: 'id 또는 파일명이 없습니다.' },
      { status: 400 }
    );
  }

  await db.summary.update({
    where: { id },
    data: { fileName },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
