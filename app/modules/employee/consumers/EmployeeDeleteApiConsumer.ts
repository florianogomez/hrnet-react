import type { ApiResponseInterface } from "~/services/api/interfaces/ApiResponseInterface";
import { ApiError, NotFoundApiError } from "~/services/api/errors";
import ApiHttpMethodEnum from "~/services/api/enums/ApiHttpMethodEnum";
import { ApiModeEnum } from "~/enums/ApiModeEnum";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import { EmployeeApiConsumer } from "./EmployeeApiConsumer";
import { employeeStorageService } from "../services/EmployeeStorageService";
import config from "~/config";

/**
 * API consumer for deleting an employee.
 *
 * Handles the DELETE /employees/:id API request and supports both real and mock modes.
 *
 * @class EmployeeDeleteApiConsumer
 * @extends EmployeeApiConsumer
 */
export class EmployeeDeleteApiConsumer extends EmployeeApiConsumer {
	/**
	 * Creates a new instance of the employee deletion API consumer.
	 *
	 * @param {EmployeeInterface["id"]} employeeId - The ID of the employee to delete.
	 */
	constructor(private employeeId: EmployeeInterface["id"]) {
		const path = `${EmployeeApiConsumer.route}/${employeeId}`;
		const method = ApiHttpMethodEnum.DELETE;
		super({ path, method });
	}

	/**
	 * Executes the API request to delete an employee.
	 *
	 * @returns {Promise<{ success: boolean; message: string } | ApiError>} Confirmation of deletion or an API error.
	 */
	async request(): Promise<{ success: boolean; message: string } | ApiError> {
		// If mock mode is enabled, return simulated data
		if (config.apiMode === ApiModeEnum.MOCK) {
			return this.mockRequest();
		}

		this.setIsLoading(true);
		const response: ApiResponseInterface<{ success: boolean; message: string }> | ApiError = await super.request();
		this.setIsLoading(false);

		if (response instanceof ApiError) return response;

		return response.body!;
	}

	/**
	 * Simulates an API request for mock mode.
	 *
	 * @returns {Promise<{ success: boolean; message: string } | ApiError>} Confirmation of deletion or an API error.
	 */
	async mockRequest(): Promise<{ success: boolean; message: string } | ApiError> {
		// Simulate network delay
		this.setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, config.mockDuration || 1000));
		this.setIsLoading(false);
		
		// Check if the employee exists
		const existingEmployee = await employeeStorageService.getEmployeeById(this.employeeId);
		
		if (!existingEmployee) {
			return new NotFoundApiError(`/employees/${this.employeeId}`, {
				message: `Employee with ID ${this.employeeId} was not found.`,
				status: 404,
			});
		}

		// Delete the employee
		await employeeStorageService.deleteEmployee(this.employeeId);

		// Simulate a successful response
		const mockResponse: ApiResponseInterface<{ success: boolean; message: string }> = {
			status: 200,
			message: "Employee deleted successfully",
			body: {
				success: true,
				message: `Employee ${existingEmployee.firstName} ${existingEmployee.lastName} was deleted successfully.`,
			},
		};

		return mockResponse.body!;
	}
}
