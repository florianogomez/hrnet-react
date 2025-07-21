import type { PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";
import type { EmployeesState } from "./setEmployeesLoadingReducer";

/**
 * Reducer to set the error message in the employees state.
 *
 * @param state - The current draft state of employees.
 * @param action - The Redux action containing the error message or null.
 */
export function setEmployeeErrorReducer(state: WritableDraft<EmployeesState>, action: PayloadAction<string | null>) {
  state.error = action.payload;
}
