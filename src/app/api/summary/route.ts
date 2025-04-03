import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';
import * as mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  console.log(file);
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: '유효한 파일이 아닙니다.' },
      { status: 400 }
    );
  }

  try {
    // 확장자에 따라 텍스트 추출
    const content = await extractTextFromFile(file);

    // 요약 요청
    const summary = await summarizeTextWithGPT(content);

    return NextResponse.json({ summary });
  } catch (error) {
    const err = error as Error; // Error 객체로 단언
    console.error('[SUMMARY_ERROR]', error);
    return NextResponse.json(
      { error: err.message ?? '요약 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 파일 확장자별 텍스트 추출
async function extractTextFromFile(file: File): Promise<string> {
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
async function summarizeTextWithGPT(text: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    // model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: '다음 텍스트를 한국어로 간단하게 요약해줘.',
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.7,
  });

  return (
    completion.choices[0].message.content ?? '요약 결과를 가져오지 못했어요.'
  );
}
