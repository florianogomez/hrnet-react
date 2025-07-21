import { createLogger } from "~/utils/logger";
import { ApiError } from "~/services/api/errors";
import type { EmployeeFilterInterface } from "../interfaces/EmployeeFilterInterface";
import { EmployeeListApiConsumer } from "../consumers/EmployeeListApiConsumer";
import type { EmployeeModel } from "../models";
import { employeeStorageService } from "../services/EmployeeStorageService";

const logger = createLogger("getEmployeesAction");

/**
 * Action to retrieve the list of employees with optional filters.
 *
 * Calls the API to fetch employees, handles errors, and returns the list.
 *
 * @param {EmployeeFilterInterface} [payload={}] - Optional filters for the request.
 * @returns {Promise<EmployeeModel[] | null>} The list of employees or null if an error occurs.
 *
 * @throws {Error} If the API returns an error or the fetch fails.
 *
 * @example
 * const employees = await getEmployeesAction({ department: 'Sales' });
 */
export const getEmployeesAction = async (
  payload: EmployeeFilterInterface = {}
): Promise<EmployeeModel[] | null> => {
  try {
    logger.info("Get employees attempt:", payload);

    const api = new EmployeeListApiConsumer({ ...payload });
    const result = await api.request();

    if (result instanceof ApiError) {
      logger.error("Get employees API error:", result.message);
      throw new Error(`Error while fetching employees: ${result.message}`);
    }

    logger.info(`Retrieved ${Array.isArray(result) ? result.length : 0} employees`);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    logger.error("Get employees error:", error);
    throw error;
  }
};
