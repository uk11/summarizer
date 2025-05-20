import { authOptions } from './authOptions';
import { getServerSession } from 'next-auth';
import { getAnonymousId } from './auth';
import { db } from './prisma';
import path from 'path';
import * as mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getSummary() {
  const session = await getServerSession(authOptions);

  if (session?.user.id) {
    return db.summary.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    });
  }

  const anonymousId = await getAnonymousId();

  if (anonymousId) {
    return db.summary.findMany({
      where: { anonymousId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  return [];
}

// 파일 확장자별 텍스트 추출
export async function extractText(file: File) {
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

// 로그인/비로그인 유저 id 구분
export async function getUserOrAnonymousId() {
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

// GPT 요약 요청
export async function generateSummary(fileContent: string) {
  const res = await openai.chat.completions.create({
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

  return res.choices[0].message.content ?? '요약 결과를 가져오지 못했어요.';
}

// GPT 제목 요청
export async function generateTitle(text: string) {
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `제공된 텍스트를 요약해서 한국어 10글자 이내로 제목을 생성해주세요.
        반드시 한국어 10글자 이하로 생성해주세요.
        `,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.5,
  });

  return res.choices[0].message.content?.trim() ?? '제목없음';
}
