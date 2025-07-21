import type { PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";
import type { EmployeesState } from "./setEmployeesLoadingReducer";
import type { EmployeeInterface } from "../../interfaces/EmployeeInterface";

/**
 * Reducer to add an employee to the list in the EmployeesState.
 *
 * @param state - The current draft state of employees.
 * @param action - The Redux action containing the employee to add.
 */
export function addEmployeeReducer(state: WritableDraft<EmployeesState>, action: PayloadAction<EmployeeInterface>) {
  state.employees.push(action.payload);
  state.justAdded = action.payload;
}
