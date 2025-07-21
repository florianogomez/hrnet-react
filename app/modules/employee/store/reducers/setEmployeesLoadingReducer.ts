import type { PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";
import type { EmployeeInterface } from "../../interfaces/EmployeeInterface";

/**
 * State interface for the employees slice.
 */
export interface EmployeesState {
  /** List of all employees. */
  employees: EmployeeInterface[];
  /** Loading/processing flag for async actions. */
  processing: boolean;
  /** The employee that was just added, or null. */
  justAdded: EmployeeInterface | null;
  /** Error message, or null if no error. */
  error: string | null;
}

/**
 * Reducer to set the loading/processing flag in the employees state.
 *
 * @param state - The current draft state of employees.
 * @param action - The Redux action containing the loading flag value.
 */
export function setEmployeesLoadingReducer(state: WritableDraft<EmployeesState>, action: PayloadAction<boolean>) {
  state.processing = action.payload;
}
