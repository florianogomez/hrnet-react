import type { PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";
import type { EmployeesState } from "./setEmployeesLoadingReducer";
import type { EmployeeInterface } from "../../interfaces/EmployeeInterface";

/**
 * Reducer to set the employee that was just added in the employees state.
 *
 * @param state - The current draft state of employees.
 * @param action - The Redux action containing the employee or null.
 */
export function setEmployeeJustAddedReducer(state: WritableDraft<EmployeesState>, action: PayloadAction<EmployeeInterface | null>) {
  state.justAdded = action.payload;
}
