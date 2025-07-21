import { EmployeeApiConsumer as BaseEmployeeApiConsumer } from "~/services/api/consumers/EmployeeApiConsumer";
import { store } from "~/store";
import { setEmployeesLoading } from "../store/employees_slice";

/**
 * Base consumer for employee-related APIs.
 *
 * Extends the main API consumer with employee-specific features, such as Redux loading state management.
 *
 * @class EmployeeApiConsumer
 * @extends BaseEmployeeApiConsumer
 */
export class EmployeeApiConsumer extends BaseEmployeeApiConsumer {
	/**
	 * The API route for employee endpoints.
	 * @type {string}
	 * @readonly
	 */
	static readonly route = "/employees";

	/**
	 * Sets the loading state in the Redux store for employee requests.
	 *
	 * @protected
	 * @param {boolean} loading - Whether a request is in progress.
	 */
	protected setIsLoading(loading: boolean): void {
		store.dispatch(setEmployeesLoading(loading));
	}
}
