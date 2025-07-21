/**
 * Exports all employee-related reducers and the EmployeesState type for easy import.
 *
 * @module EmployeeReducers
 */
export { setEmployeesLoadingReducer } from "./setEmployeesLoadingReducer";
export { setEmployeesReducer } from "./setEmployeesReducer";
export { addEmployeeReducer } from "./addEmployeeReducer";
export { setEmployeeJustAddedReducer } from "./setEmployeeJustAddedReducer";
export { setEmployeeErrorReducer } from "./setEmployeeErrorReducer";
export { resetEmployeesReducer } from "./resetEmployeesReducer";
export { deleteEmployeeReducer } from "./deleteEmployeeReducer";

export type { EmployeesState } from "./setEmployeesLoadingReducer";
