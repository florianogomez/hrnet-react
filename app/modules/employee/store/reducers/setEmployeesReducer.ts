import type { PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";
import type { EmployeesState } from "./setEmployeesLoadingReducer";
import type { EmployeeInterface } from "../../interfaces/EmployeeInterface";

/**
 * Reducer to set the complete list of employees in the employees state.
 *
 * @param state - The current draft state of employees.
 * @param action - The Redux action containing the new list of employees.
 */
export function setEmployeesReducer(state: WritableDraft<EmployeesState>, action: PayloadAction<EmployeeInterface[]>) {
  state.employees = action.payload;
}
