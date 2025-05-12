import { Summary } from '@prisma/client';

export const uploadAndSummary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);

  const res = await fetch('/api/summary', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const { error } = await res.json();
    console.error('summary 업로드 실패' + error);
  }

  return res.json();
};

export const getSummary = async (): Promise<{ data: Summary[] }> => {
  const res = await fetch('/api/summary/');

  if (!res.ok) {
    const { error } = await res.json();
    console.error('summary 조회 실패' + error);
  }

  return res.json();
};

export const deleteSummary = async (id: string) => {
  const res = await fetch(`/api/summary/${id}`, { method: 'DELETE' });

  if (!res.ok) {
    const { error } = await res.json();
    console.error('summary 삭제 실패' + error);
  }
};

export const updateSummaryFileName = async (id: string, fileName: string) => {
  const res = await fetch(`/api/summary/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    console.error('summary filename 수정 실패' + error);
  }
};

export const getChatMessages = async (summaryId: string) => {
  const res = await fetch(`/api/chat/${summaryId}`);

  if (!res.ok) {
    const { error } = await res.json();
    console.error('chat 조회 실패' + error);
  }

  const data = await res.json();
  return data.messages as { role: 'user' | 'assistant'; content: string }[];
};

export const postChatMessage = async (summaryId: string, question: string) => {
  const res = await fetch('/api/chat/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summaryId, question }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    console.error('chat 생성 실패' + error);
  }
};

export const updateSummarySaved = async (id: string, isSaved: boolean) => {
  const res = await fetch(`/api/summary/${id}/save`, {
    method: 'PATCH',
    body: JSON.stringify({ isSaved: !isSaved }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    console.error('summary 저장 실패' + error);
  }
};
