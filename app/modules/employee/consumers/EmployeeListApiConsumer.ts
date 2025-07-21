import type { ApiResponseInterface } from "~/services/api/interfaces/ApiResponseInterface";
import { ApiError } from "~/services/api/errors";
import ApiHttpMethodEnum from "~/services/api/enums/ApiHttpMethodEnum";
import { ApiModeEnum } from "~/enums/ApiModeEnum";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import type { EmployeeFilterInterface } from "../interfaces/EmployeeFilterInterface";
import { employeeStorageService } from "../services/EmployeeStorageService";
import { EmployeeApiConsumer } from "./EmployeeApiConsumer";
import { EmployeeModel } from "../models";
import config from "~/config";

/**
 * API consumer for retrieving the list of employees.
 *
 * Handles the GET /employees API request with optional filtering and supports both real and mock modes.
 *
 * @class EmployeeListApiConsumer
 * @extends EmployeeApiConsumer
 */
export class EmployeeListApiConsumer extends EmployeeApiConsumer {
	/**
	 * The filters for the employee list request.
	 * @type {EmployeeFilterInterface}
	 */
	data: EmployeeFilterInterface;

	/**
	 * Creates a new instance of the employee list API consumer.
	 *
	 * @param {EmployeeFilterInterface} data - Filters for the request.
	 */
	constructor(data: EmployeeFilterInterface) {
		const path = `${EmployeeApiConsumer.route}`;
		const method = ApiHttpMethodEnum.GET;
		super({ path, method, data });
		this.data = data;
	}

	/**
	 * Executes the API request to retrieve employees.
	 *
	 * @returns {Promise<EmployeeModel[] | ApiError>} The list of employees or an API error.
	 */
	async request(): Promise<EmployeeModel[] | ApiError> {
		// If mock mode is enabled, return simulated data
		if (config.apiMode === ApiModeEnum.MOCK) {
			return this.mockRequest();
		}

		this.setIsLoading(true);
		const response: ApiResponseInterface<EmployeeInterface[]> | ApiError = await super.request();
		this.setIsLoading(false);

		if (response instanceof ApiError) return response;

		return (response.body || []).map((employee: EmployeeInterface) => new EmployeeModel(employee));
	}

	/**
	 * Simulates an API request for mock mode.
	 *
	 * @returns {Promise<EmployeeModel[] | ApiError>} The list of employees or an API error.
	 */
	async mockRequest(): Promise<EmployeeModel[] | ApiError> {
		// Simulate network delay
		this.setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, config.mockDuration || 1000));
		this.setIsLoading(false);
		
		// Simulate a successful response
		const mockResponse: ApiResponseInterface<EmployeeInterface[]> = {
			status: 200,
			message: "Employee list retrieved successfully",
			body: (await employeeStorageService.getEmployees()) || [],
		};

		return mockResponse.body!.map((item: EmployeeInterface) => new EmployeeModel(item));
	}
}
