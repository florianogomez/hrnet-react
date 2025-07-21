import { createLogger } from "~/utils/logger";
import { ApiError } from "~/services/api/errors";
import { EmployeeCreateApiConsumer } from "../consumers/EmployeeCreateApiConsumer";
import type { EmployeeCreateApiPayloadInterface } from "../interfaces/EmployeeCreateApiPayloadInterface";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import type { EmployeeModel } from "../models";
import { employeeStorageService } from "../services/EmployeeStorageService";

const logger = createLogger("createEmployeeAction");

/**
 * Action to create a new employee.
 *
 * Calls the API to create an employee, handles errors, and stores the created employee locally.
 *
 * @param {EmployeeCreateApiPayloadInterface} payload - The data of the employee to create.
 * @returns {Promise<EmployeeModel | null>} The created employee or null if an error occurs.
 *
 * @throws {Error} If the API returns an error or the creation fails.
 *
 * @example
 * const newEmployee = await createEmployeeAction({ firstName: 'John', lastName: 'Doe', ... });
 */
export const createEmployeeAction = async (
  payload: EmployeeCreateApiPayloadInterface
): Promise<EmployeeModel | null> => {
  try {
    logger.info("Create employee attempt:", { firstName: payload.firstName, lastName: payload.lastName });

    const api = new EmployeeCreateApiConsumer(payload);
    const result = await api.request();

    if (result instanceof ApiError) {
      logger.error("Create employee API error:", result.message);
      throw new Error(`Error while creating employee: ${result.message}`);
    }

    // Store the newly created employee
    await employeeStorageService.addEmployee(result.interface);

    logger.info("Employee created successfully:", result.fullName);
    return result;
  } catch (error) {
    logger.error("Create employee error:", error);
    throw error;
  }
};
