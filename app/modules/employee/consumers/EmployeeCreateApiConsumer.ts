import type { ApiResponseInterface } from "~/services/api/interfaces/ApiResponseInterface";
import { ApiError, ConflictApiError } from "~/services/api/errors";
import ApiHttpMethodEnum from "~/services/api/enums/ApiHttpMethodEnum";
import { ApiModeEnum } from "~/enums/ApiModeEnum";
import { faker } from "@faker-js/faker";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import { EmployeeApiConsumer } from "./EmployeeApiConsumer";
import type { EmployeeCreateApiPayloadInterface } from "../interfaces/EmployeeCreateApiPayloadInterface";
import { employeeStorageService } from "../services/EmployeeStorageService";
import config from "~/config";
import { EmployeeModel } from "../models";

/**
 * API consumer for creating a new employee.
 *
 * Handles the POST /employees API request and supports both real and mock modes.
 *
 * @class EmployeeCreateApiConsumer
 * @extends EmployeeApiConsumer
 */
export class EmployeeCreateApiConsumer extends EmployeeApiConsumer {
	/**
	 * Creates a new instance of the employee creation API consumer.
	 *
	 * @param {EmployeeCreateApiPayloadInterface} data - The data of the employee to create.
	 */
	constructor(public data: EmployeeCreateApiPayloadInterface) {
		const path = EmployeeApiConsumer.route;
		const method = ApiHttpMethodEnum.POST;
		super({ path, method, data });
	}

	/**
	 * Executes the API request to create an employee.
	 *
	 * @returns {Promise<EmployeeModel | ApiError>} The created employee or an API error.
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
	 * @returns {Promise<EmployeeModel | ApiError>} The created employee or an API error.
	 */
	async mockRequest(): Promise<EmployeeModel | ApiError> {
		// Simulate network delay
		this.setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, config.mockDuration || 1000));
		this.setIsLoading(false);
		
		// Simulate a successfully created employee
		const createdEmployee: EmployeeInterface = {
			id: faker.string.uuid(),
			firstName: this.data.firstName,
			lastName: this.data.lastName,
			dateOfBirth: this.data.dateOfBirth,
			startDate: this.data.startDate,
			department: this.data.department,
			street: this.data.street,
			city: this.data.city,
			state: this.data.state,
			zipCode: this.data.zipCode,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// The employee will be added to storage by the action, not here, to avoid duplication

		// Simulate a successful response
		const mockResponse: ApiResponseInterface<EmployeeInterface> = {
			status: 201,
			message: "Employee created successfully",
			body: createdEmployee,
		};

		return new EmployeeModel(mockResponse.body!);
	}
}
