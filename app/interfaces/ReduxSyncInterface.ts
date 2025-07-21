import type { RootState } from "~/store";

/**
 * Interface for synchronizing data with Redux state.
 * Provides utilities for both reading from and updating the Redux store.
 * 
 * @interface ReduxSyncInterface
 * @template T - The type of data to be synchronized with the Redux store.
 * @property {(state: RootState) => T} selector - Function that extracts a value from the global state.
 * @property {(payload: T) => any} action - Redux action creator to dispatch for updating the value.
 * @example
 * const employeeSync: ReduxSyncInterface<EmployeeInterface[]> = {
 *   selector: (state) => state.employee.employees,
 *   action: (employees) => setEmployees(employees)
 * };
 */
export interface ReduxSyncInterface<T> {
	/**
	 * Function that extracts the value from the global state
	 */
	selector: (state: RootState) => T;

	/**
	 * Redux action to dispatch to update the value
	 */
	action: (payload: T) => any;
}
