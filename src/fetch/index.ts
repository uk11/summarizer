import { Summary } from '@prisma/client';

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

export const getSummary = async (): Promise<Summary[]> => {
  const res = await fetch('/api/summary/', { method: 'GET' });

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
