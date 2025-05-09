import dayjs from 'dayjs';

export function formatDate(date: string | Date, pattern: string) {
  return dayjs(date).format(pattern);
}
