'use client';

import TextArea from './TextArea';
import FileDrop from './FileDrop';
import { useAtom } from 'jotai';
import { isFileModeAtom } from '@/store';

export default function Upload() {
  const [isFileMode, setIsFileMode] = useAtom(isFileModeAtom);

  return isFileMode ? (
    <FileDrop onSwitch={() => setIsFileMode(false)} />
  ) : (
    <TextArea onSwitch={() => setIsFileMode(true)} />
  );
}
