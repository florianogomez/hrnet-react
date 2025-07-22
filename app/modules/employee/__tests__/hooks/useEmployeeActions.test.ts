import { renderHook, act } from '@testing-library/react';
import { useEmployeeActions } from '../../hooks/useEmployeeActions';
import * as hooks from '~/store/hooks/useAppDispatch';

jest.mock('~/store/hooks/useAppDispatch');

const mockDispatch = jest.fn();
(hooks.useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);

describe('useEmployeeActions', () => {
  it('should provide modal state and handlers', () => {
    const { result } = renderHook(() => useEmployeeActions());
    expect(result.current.confirmModal).toBeDefined();
    expect(typeof result.current.handleDelete).toBe('function');
  });

  // Pour tester le handler de suppression, il faudrait mocker deleteEmployeeAction et deleteEmployeeApiAction
  // et simuler l'appel de onConfirm du modal
});
