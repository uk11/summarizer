import { atom } from 'jotai';

export const isSidebarOpenAtom = atom(false);

export const toastMessageAtom = atom<string | null>(null);

export const toastTypeAtom = atom<'success' | 'error' | null>(null);
