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
import { useParams, useRouter } from 'next/navigation';
import { RiEdit2Line, RiDeleteBinLine, RiArchive2Line } from 'react-icons/ri';
import { deleteSummary, updateSummarySaved } from '@/fetch';
import DeleteModal from './DeleteModal';
import clsx from 'clsx';
import SaveModal from './SaveModal';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/useToast';

type Props = {
  fileName: string;
  isSaved: boolean;
  currentId: string | null;
  btnRef: RefObject<HTMLButtonElement | null>;
  setCurrentId: (id: string | null) => void;
  onEdit: () => void;
};

export default function SummaryDropdown({
  fileName,
  isSaved,
  currentId,
  btnRef,
  setCurrentId,
  onEdit,
}: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const { status } = useSession();
  const { showToast } = useToast();

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

  const { targetRef } = useOnClickOutside({
    onClickOutside: () => {
      if (!isDeleteModalOpen && !isSaveModalOpen) {
        setCurrentId(null);
      }
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteSummary,

    onSuccess: () => {
      if (params.id === currentId) {
        router.replace('/');
      }
      setCurrentId(null);
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
      showToast('삭제되었습니다.', 'success');
    },
  });

  const { mutate: saveMutate } = useMutation({
    mutationFn: ({
      currentId,
      isSaved,
    }: {
      currentId: string;
      isSaved: boolean;
    }) => updateSummarySaved(currentId, isSaved),

    onSuccess: () => {
      if (params.id === currentId) {
        router.replace('/');
      }
      setCurrentId(null);
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
      showToast('저장되었습니다.', 'success');
    },
  });

  return createPortal(
    <div
      className={clsx(
        'fixed top-0 left-0 p-[8px] w-max border bg-white rounded-[8px] z-50 ml-[100px]',
        'dark-mode dark-modal-soft dark:border-none',
        (isDeleteModalOpen || isSaveModalOpen) && 'hidden'
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
          className='w-full flex items-center px-[8px] py-[6px] gap-[10px] hover:bg-gray-100 hover:rounded-[8px] hover:dark:bg-dark-500'
          onClick={onEdit}
        >
          <RiEdit2Line className='w-[20px] h-[20px]' />
          제목 수정
        </button>

        <button
          className='w-full flex items-center px-[8px] py-[6px] gap-[10px] hover:bg-gray-100 hover:rounded-[8px] hover:dark:bg-dark-500'
          onClick={() => {
            if (status === 'unauthenticated') {
              setCurrentId(null);
              showToast('로그인 사용자만 저장할 수 있습니다.', 'error');
            } else setIsSaveModalOpen(!isSaveModalOpen);
          }}
        >
          <RiArchive2Line className='w-[20px] h-[20px]' />
          저장하기
        </button>

        <button
          className='w-full flex items-center px-[8px] py-[6px] gap-[10px] text-red-500 hover:bg-red-50 hover:rounded-[8px] hover:dark:bg-dark-500'
          onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        >
          <RiDeleteBinLine className='w-[20px] h-[20px]' />
          삭제
        </button>
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          fileName={fileName}
          onClose={() => {
            setIsDeleteModalOpen(!isDeleteModalOpen);
            setCurrentId(null);
          }}
          onDelete={() => currentId && deleteMutate(currentId)}
        />
      )}

      {isSaveModalOpen && (
        <SaveModal
          isOpen={isSaveModalOpen}
          fileName={fileName}
          onClose={() => {
            setIsSaveModalOpen(!isSaveModalOpen);
            setCurrentId(null);
          }}
          onSave={() => {
            if (currentId) {
              saveMutate({ currentId, isSaved });
            }
          }}
        />
      )}
    </div>,
    document.body
  );
}
