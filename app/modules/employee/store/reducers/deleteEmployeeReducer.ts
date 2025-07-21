import type { PayloadAction } from "@reduxjs/toolkit";
import type { EmployeesState } from "../employees_slice";

/**
 * Reducer to remove an employee from the list in EmployeesState.
 *
 * @param state - The current employees state.
 * @param action - The Redux action containing the employee ID to remove.
 */
export const deleteEmployeeReducer = (
  state: EmployeesState,
  action: PayloadAction<string>
) => {
  const employeeId = action.payload;
  state.employees = state.employees.filter(employee => employee.id !== employeeId);
  state.error = null;
};
