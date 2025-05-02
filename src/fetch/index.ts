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

export const deleteSummary = async (id: string) => {
  const res = await fetch(`/api/summary/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('요약 삭제 실패');
};
