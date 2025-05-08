import {
  useFloating,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react-dom-interactions';
import { RefObject, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from '@/hooks/useOutsideClick';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';
import { deleteSummary } from '@/fetch';
import DeleteModal from './DeleteModal';
import clsx from 'clsx';

type Props = {
  fileName: string;
  currentId: string | null;
  btnRef: RefObject<HTMLButtonElement | null>;
  setCurrentId: (id: string | null) => void;
  onEdit: () => void;
};

export default function SummaryDropdown({
  fileName,
  currentId,
  btnRef,
  setCurrentId,
  onEdit,
}: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { refs, x, y, update } = useFloating({
    placement: 'bottom-end',
    middleware: [flip(), shift()],
  });

  useLayoutEffect(() => {
    const referenceEl = btnRef.current;
    const floatingEl = refs.floating.current;

    if (!referenceEl || !floatingEl) return;

    refs.reference.current = referenceEl;

    return autoUpdate(referenceEl, floatingEl, update);
  }, [btnRef, refs.reference, refs.floating, update]);

  const handleSummaryDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const { targetRef } = useOnClickOutside({
    onClickOutside: () => {
      if (!isDeleteModalOpen) setCurrentId(null);
    },
  });

  const { mutate } = useMutation({
    mutationFn: deleteSummary,
    onSuccess: () => {
      setCurrentId(null);
      router.replace('/');
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
  });

  return createPortal(
    <div
      className={clsx(
        'fixed top-0 left-0 p-[8px] w-max border bg-white rounded-[8px] z-50 ml-[100px]',
        isDeleteModalOpen && 'hidden'
      )}
      ref={(node) => {
        refs.floating.current = node;
        targetRef.current = node;
      }}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <div>
        <button
          className='w-full flex items-center px-[8px] py-[6px] gap-[10px] hover:bg-gray-100 hover:rounded-[8px]'
          onClick={onEdit}
        >
          <RiEdit2Line className='w-[20px] h-[20px]' />
          제목 수정
        </button>

        <button
          className='w-full flex items-center px-[8px] py-[6px] gap-[10px] hover:bg-gray-100 hover:rounded-[8px]'
          onClick={handleSummaryDelete}
        >
          <RiDeleteBinLine className='w-[20px] h-[20px]' />
          삭제
        </button>
      </div>

      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        fileName={fileName}
        currentId={currentId}
        onClose={() => {
          setIsDeleteModalOpen(!isDeleteModalOpen);
          setCurrentId(null);
        }}
        onDelete={() => {
          if (currentId) mutate(currentId);
        }}
      />
    </div>,
    document.body
  );
}
