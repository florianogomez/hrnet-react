import { createLogger } from "~/utils/logger";
import { ApiError } from "~/services/api/errors";
import { EmployeeUpdateApiConsumer } from "../consumers/EmployeeUpdateApiConsumer";
import type { EmployeeCreateApiPayloadInterface } from "../interfaces/EmployeeCreateApiPayloadInterface";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import type { EmployeeModel } from "../models";
import { employeeStorageService } from "../services";

const logger = createLogger("updateEmployeeAction");

/**
 * Action to update an existing employee.
 *
 * Calls the API to update an employee, handles errors, and updates the employee locally.
 *
 * @param {EmployeeInterface["id"]} employeeId - The ID of the employee to update.
 * @param {Partial<EmployeeCreateApiPayloadInterface>} payload - The new data for the employee.
 * @returns {Promise<EmployeeModel | null>} The updated employee or null if an error occurs.
 *
 * @throws {Error} If the API returns an error or the update fails.
 *
 * @example
 * const updated = await updateEmployeeAction(employeeId, { firstName: 'Jane' });
 */
export const updateEmployeeAction = async (
  employeeId: EmployeeInterface["id"],
  payload: Partial<EmployeeCreateApiPayloadInterface>
): Promise<EmployeeModel | null> => {
  try {
    logger.info("Update employee attempt:", { employeeId, data: payload });

    const api = new EmployeeUpdateApiConsumer(employeeId, payload);
    const result = await api.request();

    if (result instanceof ApiError) {
      logger.error("Update employee API error:", result.message);
      throw new Error(`Error while updating employee: ${result.message}`);
    }

    // Store the updated employee
    await employeeStorageService.updateEmployee(result.interface);

    logger.info("Employee updated successfully:", result.fullName);
    return result;
  } catch (error) {
    logger.error("Update employee error:", error);
    throw error;
  }
};
