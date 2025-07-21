import { useState, useCallback } from 'react';
import type { ConfirmModalState } from './modal.types';

/**
 * Generic hook to manage a confirmation modal state and actions.
 * @param initialState - The initial state of the modal
 * @returns Modal state, open/close helpers, and a setter
 */
export function useConfirmModal(initialState: ConfirmModalState) {
  const [modal, setModal] = useState<ConfirmModalState>(initialState);
  const open = useCallback((state: Partial<ConfirmModalState>) => setModal({ ...initialState, ...state, isOpen: true }), [initialState]);
  const close = useCallback(() => setModal(initialState), [initialState]);
  return { modal, open, close, setModal };
}
