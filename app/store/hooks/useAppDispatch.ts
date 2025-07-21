/**
 * Custom typed dispatch hook for dispatching Redux actions.
 *
 * @function useAppDispatch
 * @returns {AppDispatch} Typed dispatch function
 *
 * A pre-typed version of the useDispatch hook from React Redux.
 * Provides proper TypeScript typing for Redux actions and thunks.
 *
 * @example
 * // In a component
 * const dispatch = useAppDispatch();
 *
 * // Dispatching a regular action
 * dispatch(employeeActions.clearEmployees());
 *
 * // Dispatching an async thunk action
 * dispatch(addEmployee(employeeData));
 */
import { useDispatch } from "react-redux";
import type { AppDispatch } from "~/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
