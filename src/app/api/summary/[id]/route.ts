import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: {
    id: string;
  };
};

export async function DELETE(_: NextRequest, { params }: Props) {
  try {
    await db.summary.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '서버 오류가 발생했습니다.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
