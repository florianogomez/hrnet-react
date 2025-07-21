/**
 * Custom typed selector hook for accessing Redux state.
 *
 * @function useAppSelector
 * @type {TypedUseSelectorHook<RootState>}
 *
 * A pre-typed version of the useSelector hook from React Redux.
 * Provides proper TypeScript typing for the Redux store state.
 *
 * @example
 * // Select user data from the store
 * const userData = useAppSelector((state) => state.user.profile);
 *
 * // Select authentication status
 * const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
 */
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "~/store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
