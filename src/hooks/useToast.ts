import { toastMessageAtom, toastTypeAtom } from '@/store';
import { useAtom } from 'jotai';

export function useToast() {
  const [toastMessage, setToastMessage] = useAtom(toastMessageAtom);
  const [toastType, setToastType] = useAtom(toastTypeAtom);

  const showToast = (msg: string, toastType: 'success' | 'error') => {
    setToastMessage(msg);
    setToastType(toastType);

    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 2000);
  };

  return {
    toastMessage,
    toastType,
    showToast,
  };
}
