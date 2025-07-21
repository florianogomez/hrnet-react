import type { ApiResponseInterface } from "~/services/api/interfaces/ApiResponseInterface";
import { ApiError, NotFoundApiError } from "~/services/api/errors";
import ApiHttpMethodEnum from "~/services/api/enums/ApiHttpMethodEnum";
import { ApiModeEnum } from "~/enums/ApiModeEnum";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import { EmployeeApiConsumer } from "./EmployeeApiConsumer";
import { EmployeeModel } from "../models";
import { employeeStorageService } from "../services/EmployeeStorageService";
import config from "~/config";

/**
 * API consumer for retrieving a specific employee by ID.
 *
 * Handles the GET /employees/:id API request and supports both real and mock modes.
 *
 * @class EmployeeFindApiConsumer
 * @extends EmployeeApiConsumer
 */
export class EmployeeFindApiConsumer extends EmployeeApiConsumer {
	/**
	 * Creates a new instance of the employee find API consumer.
	 *
	 * @param {EmployeeInterface["id"]} employeeId - The ID of the employee to retrieve.
	 */
	constructor(private employeeId: EmployeeInterface["id"]) {
		const path = `${EmployeeApiConsumer.route}/${employeeId}`;
		const method = ApiHttpMethodEnum.GET;
		super({ path, method });
	}

	/**
	 * Executes the API request to retrieve an employee.
	 *
	 * @returns {Promise<EmployeeModel | ApiError>} The found employee or an API error.
	 */
	async request(): Promise<EmployeeModel | ApiError> {
		// If mock mode is enabled, return simulated data
		if (config.apiMode === ApiModeEnum.MOCK) {
			return this.mockRequest();
		}

		this.setIsLoading(true);
		const response: ApiResponseInterface<EmployeeInterface> | ApiError = await super.request();
		this.setIsLoading(false);

		if (response instanceof ApiError) return response;

		return new EmployeeModel(response.body!);
	}

	/**
	 * Simulates an API request for mock mode.
	 *
	 * @returns {Promise<EmployeeModel | ApiError>} The found employee or an API error.
	 */
	async mockRequest(): Promise<EmployeeModel | ApiError> {
		// Simulate network delay
		this.setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, config.mockDuration || 1000));
		this.setIsLoading(false);

		const employee = await employeeStorageService.getEmployeeById(this.employeeId);

		if (!employee) {
			return new NotFoundApiError(`/employees/${this.employeeId}`, {
				message: `Employee with ID ${this.employeeId} was not found.`,
				status: 404,
			});
		}

		// Simulate a successful response
		const mockResponse: ApiResponseInterface<EmployeeInterface> = {
			status: 200,
			message: "Employee found successfully",
			body: employee,
		};

		return new EmployeeModel(mockResponse.body!);
	}
}
