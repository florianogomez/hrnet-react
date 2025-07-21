import { ApiConsumer } from "../ApiConsumer";
import { hrnetApiClient } from "../clients";
import type ApiHttpMethodEnum from "../enums/ApiHttpMethodEnum";

/**
 * Interface defining the parameters needed to configure an instance of EmployeeApiConsumer.
 * @interface EmployeeApiConsumerArgumentsInterface
 * @property {string} path - The path of the HRNet API to call (e.g., "/employees/12").
 * @property {ApiHttpMethodEnum} method - The HTTP method to use (GET, POST, etc.).
 * @property {object} [data] - Optional data to be sent with the request.
 * @example
 * ```ts
 * const apiConsumerArgs: EmployeeApiConsumerArgumentsInterface = {
 *   path: "/employees",
 *   method: ApiHttpMethodEnum.GET
 * };
 * ```
 */
export interface EmployeeApiConsumerArgumentsInterface {
	path: string;
	method: ApiHttpMethodEnum;
	data?: object;
}

/**
 * Specific API consumer for Employee operations.
 * Enables making HTTP requests to the HRNet Employee API using a preconfigured Axios client.
 * Extends the generic ApiConsumer class.
 */
export class EmployeeApiConsumer extends ApiConsumer {
	/**
	 * Creates an instance of EmployeeApiConsumer.
	 * Initializes the parent ApiConsumer class with the Axios client dedicated to HRNet and the provided parameters.
	 *
	 * @param {EmployeeApiConsumerArgumentsInterface} params - Object containing the necessary information for the API call.
	 * @param {string} params.path - The path of the HRNet API to call (e.g., "/employees/12").
	 * @param {ApiHttpMethodEnum} params.method - The HTTP method to use (GET, POST, etc.).
	 * @param {object} [params.data] - Optional data to send with the request.
	 * @example
	 * ```ts
	 * const apiConsumer = new EmployeeApiConsumer({
	 *   path: "/employees",
	 *   method: ApiHttpMethodEnum.GET
	 * });
	 * ```
	 */
	constructor({ path, method, data = {} }: EmployeeApiConsumerArgumentsInterface) {
		super({ client: hrnetApiClient, path, method, data });
	}
}
