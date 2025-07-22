import { createLogger } from "~/utils/logger";
import { ApiError } from "~/services/api/errors";
import { EmployeeFindApiConsumer } from "../consumers/EmployeeFindApiConsumer";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import type { EmployeeModel } from "../models";

const logger = createLogger("findEmployeeAction");

/**
 * Action to retrieve a specific employee by their ID.
 *
 * Calls the API to fetch an employee, handles errors, and returns the found employee.
 *
 * @param {EmployeeInterface["id"]} employeeId - The ID of the employee to retrieve.
 * @returns {Promise<EmployeeModel | null>} The found employee or null if an error occurs.
 *
 * @throws {Error} If the API returns an error or the fetch fails.
 *
 * @example
 * const employee = await findEmployeeAction(employeeId);
 */
export const findEmployeeAction = async (
  employeeId: EmployeeInterface["id"]
): Promise<EmployeeModel | null> => {
  try {
    logger.info("Find employee attempt:", { employeeId });

    const api = new EmployeeFindApiConsumer(employeeId);
    const result = await api.request();

    if (result instanceof ApiError) {
      logger.error("Find employee API error:", result.message);
      throw new Error(`Error while searching for employee: ${result.message}`);
    }

    logger.info("Employee found:", result.fullName);
    return result;
  } catch (error) {
    logger.error("Find employee error:", error);
    throw error;
  }
};
