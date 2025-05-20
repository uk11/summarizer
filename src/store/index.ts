import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const isSidebarOpenAtom = atom(false);

export const toastMessageAtom = atom<string | null>(null);

export const toastTypeAtom = atom<'success' | 'error' | null>(null);

export const isFileModeAtom = atomWithStorage(
  'upload-mode',
  true,
  createJSONStorage(() => sessionStorage)
);
