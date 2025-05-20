'use client';

import { useState } from 'react';
import TextArea from './TextArea';
import FileDrop from './FileDrop';

export default function Upload() {
  const [isTextMode, setIsTextMode] = useState(false);

  return isTextMode ? (
    <TextArea onSwitch={() => setIsTextMode(false)} />
  ) : (
    <FileDrop onSwitch={() => setIsTextMode(true)} />
  );
}
