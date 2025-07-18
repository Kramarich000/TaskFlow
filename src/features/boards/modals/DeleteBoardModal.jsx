import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { useBoardStore, useDeleteBoard } from '@features/boards';
import { AiOutlineSync } from 'react-icons/ai';
import { useModalsStore } from '@store/modalsStore';
import { Button } from '@common/ui/utilities/Button';
import { ModalBase } from '@common/ui/layout/ModalBase';
import { showToast } from '@utils/toast';

export function DeleteBoardModal() {
  const { selectedBoard } = useBoardStore(
    useShallow((state) => ({
      selectedBoard: state.selectedBoard,
    })),
  );
  const { mutate: deleteBoard, isPending } = useDeleteBoard();

  const {
    isDeleteBoardModalOpen,
    setIsDeleteBoardModalOpen,
    setIsDetailsBoardModalOpen,
  } = useModalsStore(
    useShallow((state) => ({
      isDeleteBoardModalOpen: state.isDeleteBoardModalOpen,
      setIsDeleteBoardModalOpen: state.setIsDeleteBoardModalOpen,
      setIsDetailsBoardModalOpen: state.setIsDetailsBoardModalOpen,
    })),
  );

  const [inputValue, setInputValue] = useState('');

  const handleDeleteBoard = async () => {
    if (isPending || !selectedBoard) return;

    if (inputValue.trim() === 'Удалить') {
      deleteBoard(selectedBoard.uuid, {
        onSuccess: () => {
          setInputValue('');
          setIsDeleteBoardModalOpen(false);
          setIsDetailsBoardModalOpen(false);
        },
      });
    } else {
      showToast("Пожалуйста введите 'Удалить'", 'info');
    }
  };

  const handleClose = () => {
    setInputValue('');
    setIsDeleteBoardModalOpen(false);
  };
  return (
    <ModalBase
      open={isDeleteBoardModalOpen}
      onClose={handleClose}
      maxWidth="max-w-3xl"
    >
      <h2 className="text-3xl text-center mb-8">Удаление доски</h2>
      <div className="flex flex-col items-center justify-between gap-4 sm:gap-10">
        <h2 className="text-2xl text-center">
          Вы уверены? Это действие{' '}
          <span className="text-red-700">необратимо</span>
        </h2>
        <p className="text-xl w-full flex flex-col gap-4 text-center break-words whitespace-normal">
          Введите 'Удалить' для удаления доски:
        </p>
        <div className="relative w-full">
          <input
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleDeleteBoard();
              }
            }}
            className="peer input-styles input-primary"
            placeholder=" "
            required
            disabled={isPending}
            maxLength={64}
          />
          <label className="label-styles !bg-[var(--main-modal-bg)]">
            Введите 'Удалить' для удаления
          </label>
        </div>
        <Button
          variant="primary"
          onClick={handleDeleteBoard}
          disabled={isPending}
          title="Удалить доску"
        >
          {isPending ? (
            <AiOutlineSync size={23} className="animate-spin" />
          ) : (
            'Удалить'
          )}
        </Button>
      </div>
    </ModalBase>
  );
}
