import {
  generateSummary,
  generateTitle,
  getUserOrAnonymousId,
} from '@/lib/summary';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  try {
    const summary = await generateSummary(text);
    const title = await generateTitle(text);
    const userInfo = await getUserOrAnonymousId();

    const saved = await db.summary.create({
      data: {
        content: summary,
        fileName: title,
        ...userInfo,
      },
    });

    return NextResponse.json({ id: saved.id }, { status: 201 });
  } catch (err) {
    console.error('POST /summary/text Error:', err);
    const errorMessage = (err as Error).message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
