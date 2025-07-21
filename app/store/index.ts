/**
 * Standard Redux store configuration for the HRnet application.
 *
 * @module store
 *
 * @remarks
 * This module exports the configured store, reducer types, and necessary TypeScript types.
 * It combines employee reducer into a root reducer.
 *
 * @example
 * // Accessing store in a component
 * import { store } from '~/store';
 *
 * // Getting current state
 * const state = store.getState();
 */
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { employeesReducer } from "~/modules/employee/store/employees_slice";
import { createLogger } from "~/utils/logger";

// Logger for Redux store operations
const logger = createLogger("Redux");

/**
 * Base interface for the store
 * @interface Store
 */
export interface Store {
	/** Indicates whether the user is in the login process */
	processing: boolean;
}

// Combined root reducer that includes all application state slices
const rootReducer = combineReducers({
  employee: employeesReducer,
  // Add other slices here as needed
});

/**
 * Configured Redux store instance.
 *
 * @remarks
 * Uses default middleware provided by Redux Toolkit.
 * DevTools are enabled in non-production environments.
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
});

/**
 * Type definitions exported for use throughout the application
 */
/**
 * RootState type representing the entire Redux store state structure
 * @typedef {ReturnType<typeof rootReducer>} RootState
 */
export type RootState = ReturnType<typeof rootReducer>;

/**
 * AppDispatch type for typed dispatch actions
 * @typedef {typeof store.dispatch} AppDispatch
 */
export type AppDispatch = typeof store.dispatch;

// Log d'initialisation
if (typeof window !== "undefined") {
	logger.info("Client-side store initialized");
} else {
	logger.info("Server-side store initialized");
}
