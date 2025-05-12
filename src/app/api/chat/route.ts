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

    const prevChatMessages = await db.chatMessage.findMany({
      where: { summaryId },
      orderBy: { createdAt: 'asc' },
    });

    const messages = prevChatMessages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const answer = await generateAnswer(summary.content, question, messages);

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

    return NextResponse.json({}, { status: 201 });
  } catch (err) {
    console.error('POST /chat Error:', err);
    const errorMessage = (err as Error).message;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
      content: `아래 요약 내용을 참고하여 사용자의 질문에 답변하세요.

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
