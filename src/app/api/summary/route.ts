import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';
import * as mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { db } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { getAnonymousId } from '@/lib/auth';
import { Summary } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// 파일 확장자별 텍스트 추출
async function extractText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name).toLowerCase();

  switch (ext) {
    case '.txt':
      return buffer.toString('utf-8');

    case '.docx': {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    case '.pdf': {
      const result = await pdfParse(buffer);
      return result.text;
    }

    default:
      throw new Error(`${ext} 형식은 지원하지 않습니다.`);
  }
}

// GPT 요약 요청
async function generateSummary(fileContent: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    // model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `제공된 텍스트를 이해하고 핵심 내용을 간결하고 명확하게 요약해 주세요.`,
      },
      {
        role: 'user',
        content: fileContent,
      },
    ],
    temperature: 0.7,
  });

  return (
    completion.choices[0].message.content ?? '요약 결과를 가져오지 못했어요.'
  );
}

// 로그인/비로그인 유저 id 구분
async function getUserOrAnonymousId() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const cookieStore = await cookies();
  let anonymousId = cookieStore.get('anonymousId')?.value;

  if (!userId && !anonymousId) {
    anonymousId = uuidv4();
    cookieStore.set({
      name: 'anonymousId',
      value: anonymousId,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return userId ? { userId } : { anonymousId };
}
