import { SaveSummaryAndChat } from '@prisma/client';

export const uploadAndSummary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);

  const res = await fetch('/api/summary', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('요약 요청 실패');
  return res.json();
};

export const getSummary = async () => {
  const res = await fetch('/api/summary/');

  if (!res.ok) throw new Error('요약 조회 실패');
  return res.json();
};

export const deleteSummary = async (id: string) => {
  const res = await fetch(`/api/summary/${id}`, { method: 'DELETE' });

  if (!res.ok) throw new Error('요약 삭제 실패');
};

export const updateSummary = async (id: string, fileName: string) => {
  const res = await fetch(`/api/summary/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName }),
  });

  if (!res.ok) throw new Error('요약 수정 실패');
};

export const getChatMessages = async (summaryId: string) => {
  const res = await fetch(`/api/chat/${summaryId}`);
  if (!res.ok) throw new Error('채팅 조회 실패');

  const data = await res.json();
  return data.messages as { role: 'user' | 'assistant'; content: string }[];
};

export const postChatMessage = async (summaryId: string, question: string) => {
  const res = await fetch('/api/chat/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summaryId, question }),
  });

  if (!res.ok) throw new Error('채팅 생성 실패');
};

export const postSummaryAndChat = async (id: string) => {
  const res = await fetch(`/api/summary/${id}/save`, {
    method: 'POST',
  });

  if (!res.ok) throw new Error('저장 실패');
};

export const getSummaryAndChat = async (
  id: string
): Promise<{ data: SaveSummaryAndChat[] }> => {
  const res = await fetch(`/api/summary/${id}/save`);

  if (!res.ok) throw new Error('저장 실패');
  return res.json();
};
