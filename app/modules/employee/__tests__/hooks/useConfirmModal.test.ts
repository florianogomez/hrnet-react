import { renderHook, act } from '@testing-library/react';
import { useConfirmModal } from '../../hooks/useConfirmModal';
import type { ConfirmModalState } from '../../hooks/modal.types';

describe('useConfirmModal', () => {
  const initialState: ConfirmModalState = {
    isOpen: false,
    title: '',
    content: '',
    confirmLabel: 'OK',
    cancelLabel: 'Cancel',
    confirmButtonColor: 'primary',
    cancelButtonColor: 'secondary',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    confirmProcessingLabel: undefined
  };

  it('should initialize with initial state', () => {
    const { result } = renderHook(() => useConfirmModal(initialState));
    expect(result.current.modal).toEqual(initialState);
  });

  it('should open modal with new state', () => {
    const { result } = renderHook(() => useConfirmModal(initialState));
    act(() => {
      result.current.open({ title: 'Test', isOpen: true });
    });
    expect(result.current.modal.isOpen).toBe(true);
    expect(result.current.modal.title).toBe('Test');
  });

  it('should close modal', () => {
    const { result } = renderHook(() => useConfirmModal({ ...initialState, isOpen: true }));
    act(() => {
      result.current.close();
    });
    expect(result.current.modal.isOpen).toBe(false);
  });
});
