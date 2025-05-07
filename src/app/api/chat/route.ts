import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { summaryId, question } = await req.json();

    if (!summaryId || !question) {
      return NextResponse.json(
        { error: 'summaryId와 question은 필수입니다.' },
        { status: 400 }
      );
    }

    // 요약 내용 조회
    const summary = await db.summary.findUnique({
      where: { id: summaryId },
      select: { content: true },
    });

    if (!summary) {
      return NextResponse.json(
        { error: '요약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 이전 대화 메시지 조회
    const prevMessages = await db.chatMessage.findMany({
      where: { summaryId },
      orderBy: { createdAt: 'asc' },
    });

    const messages = prevMessages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const answer = await generateAnswer(summary.content, question, messages);

    // 질문, 답변 저장
    await db.chatMessage.createMany({
      data: [
        {
          summaryId,
          role: 'user',
          content: question,
        },
        {
          summaryId,
          role: 'assistant',
          content: answer,
        },
      ],
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error('Chat API Error', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// GPT 답변 생성
async function generateAnswer(
  summaryContent: string,
  question: string,
  messages: ChatCompletionMessageParam[]
) {
  const gptMessages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `당신은 친절하고 전문적인 AI입니다. 아래 요약 내용을 참고하여 사용자의 질문에 답변하세요. 사용자가 한국어로 질문하면 한국어로, 영어로 질문하면 영어로 답변하세요.

      요약 내용:
      ${summaryContent}`,
    },
    ...messages,
    {
      role: 'user',
      content: question,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: gptMessages,
    temperature: 0.7,
  });

  return completion.choices[0].message.content ?? '답변을 생성하지 못했습니다.';
}
