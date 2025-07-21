import type { WritableDraft } from "immer";
import type { EmployeesState } from "./setEmployeesLoadingReducer";

/**
 * Reducer to reset the employees state to its initial values.
 *
 * @param state - The current draft state of employees.
 */
export function resetEmployeesReducer(state: WritableDraft<EmployeesState>) {
  state.employees = [];
  state.processing = false;
  state.justAdded = null;
  state.error = null;
}
