import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getAnonymousId } from '@/lib/auth';
import { Summary } from '@prisma/client';
import {
  extractText,
  generateSummary,
  getUserOrAnonymousId,
} from '@/lib/summary';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams.get('isSaved');
    const isSaved =
      searchParams === 'true'
        ? true
        : searchParams === 'false'
        ? false
        : undefined;

    const session = await getServerSession(authOptions);

    let summaries: Summary[] = [];

    if (session?.user.id) {
      summaries = await db.summary.findMany({
        where: {
          userId: session.user.id,
          isSaved,
        },
        orderBy: { updatedAt: 'desc' },
      });
    } else {
      const anonymousId = await getAnonymousId();

      if (anonymousId) {
        summaries = await db.summary.findMany({
          where: { anonymousId },
          orderBy: { updatedAt: 'desc' },
        });
      }
    }

    return NextResponse.json({ data: summaries }, { status: 200 });
  } catch (err) {
    console.error('GET /summary Error:', err);
    const errorMessage = (err as Error).message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  const fileName = formData.get('fileName')?.toString();

  if (!(file instanceof File))
    return NextResponse.json(
      { error: '유효한 파일이 아닙니다.' },
      { status: 400 }
    );

  if (!fileName)
    return NextResponse.json(
      { error: '파일명이 누락되었습니다.' },
      { status: 400 }
    );

  try {
    const fileContent = await extractText(file);
    const summary = await generateSummary(fileContent);
    const userInfo = await getUserOrAnonymousId();

    const saved = await db.summary.create({
      data: {
        content: summary,
        fileName,
        ...userInfo,
      },
    });

    return NextResponse.json({ id: saved.id }, { status: 201 });
  } catch (err) {
    console.error('POST /summary Error:', err);
    const errorMessage = (err as Error).message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
