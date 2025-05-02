import { useEffect, useRef } from 'react';

type Props = {
  onClickOutside: (event: PointerEvent) => void;
};

export const useOnClickOutside = <T extends HTMLElement = HTMLDivElement>({
  onClickOutside,
}: Props) => {
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const eventListener = (event: PointerEvent) => {
      if (
        !targetRef.current ||
        targetRef.current.contains(event.target as Node)
      )
        return;
      onClickOutside?.(event);
    };
    document.addEventListener('pointerdown', eventListener);
    return () => document.removeEventListener('pointerdown', eventListener);
  }, [onClickOutside, targetRef]);

  return { targetRef };
};
