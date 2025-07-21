import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Store } from "~/store";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import * as employeesReducers from "./reducers";

/**
 * Interface representing the state of the employees module in the Redux store.
 */
export interface EmployeesState extends Store {
  /** List of employees. */
  employees: EmployeeInterface[];
  /** The employee that was just added, or null. */
  justAdded: EmployeeInterface | null;
  /** Error message, or null if no error. */
  error: string | null;
}

/**
 * Initial state for the employees slice.
 */
const initialState: EmployeesState = {
  employees: [],
  processing: false,
  justAdded: null,
  error: null,
};

/**
 * Redux slice managing the employees state and actions.
 */
const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    /**
     * Sets the loading/processing flag in the employees state.
     * @param state - The current employees state.
     * @param action - The Redux action containing the loading flag value.
     */
    setEmployeesLoading(state, action: PayloadAction<boolean>) {
      employeesReducers.setEmployeesLoadingReducer(state, action);
    },
    /**
     * Sets the complete list of employees in the state.
     * @param state - The current employees state.
     * @param action - The Redux action containing the new list of employees.
     */
    setEmployees(state, action: PayloadAction<EmployeeInterface[]>) {
      employeesReducers.setEmployeesReducer(state, action);
    },
    /**
     * Adds an employee to the list in the state.
     * @param state - The current employees state.
     * @param action - The Redux action containing the employee to add.
     */
    addEmployee(state, action: PayloadAction<EmployeeInterface>) {
      employeesReducers.addEmployeeReducer(state, action);
    },
    /**
     * Sets the employee that was just added in the state.
     * @param state - The current employees state.
     * @param action - The Redux action containing the employee or null.
     */
    setEmployeeJustAdded(state, action: PayloadAction<EmployeeInterface | null>) {
      employeesReducers.setEmployeeJustAddedReducer(state, action);
    },
    /**
     * Sets the error message in the employees state.
     * @param state - The current employees state.
     * @param action - The Redux action containing the error message or null.
     */
    setEmployeeError(state, action: PayloadAction<string | null>) {
      employeesReducers.setEmployeeErrorReducer(state, action);
    },
    /**
     * Resets the employees state to its initial values.
     * @param state - The current employees state.
     */
    resetEmployees(state) {
      employeesReducers.resetEmployeesReducer(state);
    },
    /**
     * Removes an employee from the list in the state.
     * @param state - The current employees state.
     * @param action - The Redux action containing the employee ID to remove.
     */
    deleteEmployee(state, action: PayloadAction<string>) {
      employeesReducers.deleteEmployeeReducer(state, action);
    },
  },
});

/**
 * Exported employees actions and reducer.
 */
export const {
  setEmployeesLoading,
  setEmployees,
  addEmployee,
  setEmployeeJustAdded,
  setEmployeeError,
  resetEmployees,
  deleteEmployee,
} = employeesSlice.actions;

export const employeesReducer = employeesSlice.reducer;
export default employeesSlice.reducer;
