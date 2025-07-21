import type { ApiResponseInterface } from "~/services/api/interfaces/ApiResponseInterface";
import { ApiError, NotFoundApiError, ConflictApiError } from "~/services/api/errors";
import ApiHttpMethodEnum from "~/services/api/enums/ApiHttpMethodEnum";
import { ApiModeEnum } from "~/enums/ApiModeEnum";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import { EmployeeApiConsumer } from "./EmployeeApiConsumer";
import { EmployeeModel } from "../models";
import type { EmployeeCreateApiPayloadInterface } from "../interfaces/EmployeeCreateApiPayloadInterface";
import { employeeStorageService } from "../services/EmployeeStorageService";
import config from "~/config";

/**
 * API consumer for updating an existing employee.
 * Handles the API request PUT /employees/:id.
 * Extends {@link EmployeeApiConsumer}.
 */
export class EmployeeUpdateApiConsumer extends EmployeeApiConsumer {
	/**
	 * Creates a new instance of EmployeeUpdateApiConsumer.
	 * @param employeeId - The ID of the employee to update.
	 * @param data - The new data for the employee (partial payload).
	 */
	constructor(
		private employeeId: EmployeeInterface["id"],
		public data: Partial<EmployeeCreateApiPayloadInterface>
	) {
		const path = `${EmployeeApiConsumer.route}/${employeeId}`;
		const method = ApiHttpMethodEnum.PUT;
		super({ path, method, data });
	}

	/**
	 * Executes the API request to update an employee.
	 * If the API is in mock mode, returns simulated data.
	 * @returns The updated employee as an {@link EmployeeModel} or an {@link ApiError} if the request fails.
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
	 * Simulates an API request for updating an employee in mock mode.
	 * Checks if the employee exists, updates the employee, and returns the updated employee or a not found error.
	 * @returns The updated employee as an {@link EmployeeModel} or a {@link NotFoundApiError} if not found.
	 */
	async mockRequest(): Promise<EmployeeModel | ApiError> {
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

		// Update the employee
		const updatedEmployee: EmployeeInterface = {
			...existingEmployee,
			...this.data,
			id: this.employeeId,
			updatedAt: new Date().toISOString(),
		};

		await employeeStorageService.updateEmployee(updatedEmployee);

		// Simulate a successful response
		const mockResponse: ApiResponseInterface<EmployeeInterface> = {
			status: 200,
			message: "Employee updated successfully",
			body: updatedEmployee,
		};

		return new EmployeeModel(mockResponse.body!);
	}
}
