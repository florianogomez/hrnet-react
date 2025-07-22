import { renderHook, act } from '@testing-library/react';
import { useEmployeeList } from '../../hooks/useEmployeeList';
import * as hooks from '~/store/hooks/useAppDispatch';
import * as selectorHooks from '~/store/hooks/useAppSelector';

jest.mock('~/store/hooks/useAppDispatch');
jest.mock('~/store/hooks/useAppSelector');

const mockDispatch = jest.fn();
(hooks.useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
(selectorHooks.useAppSelector as jest.Mock).mockReturnValue({ employees: [], processing: false, error: null });

describe('useEmployeeList', () => {
  it('should provide employee state and actions', () => {
    const { result } = renderHook(() => useEmployeeList());
    expect(result.current.employees).toBeDefined();
    expect(typeof result.current.loadEmployees).toBe('function');
    expect(typeof result.current.addEmployee).toBe('function');
  });

  // Pour tester les callbacks asynchrones, il faudrait mocker getEmployeesAction, createEmployeeAction, etc.
});
