import { useEffect, useRef } from 'react';

type Props = {
  role: 'user' | 'assistant';
  content: string;
}[];

export default function useBottomScroll(data: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevLength = useRef<number | null>(null);

  useEffect(() => {
    if (!scrollRef.current || !data) return;

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: prevLength.current === null ? 'auto' : 'smooth',
    });

    prevLength.current = data.length;
  }, [data]);

  return { scrollRef };
}
