import { createLogger } from "~/utils/logger";
import { ApiError } from "~/services/api/errors";
import { EmployeeDeleteApiConsumer } from "../consumers/EmployeeDeleteApiConsumer";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";

const logger = createLogger("deleteEmployeeAction");

/**
 * Action to delete an employee.
 *
 * Calls the API to delete an employee by ID, handles errors, and returns confirmation.
 *
 * @param {EmployeeInterface["id"]} employeeId - The ID of the employee to delete.
 * @returns {Promise<{ success: boolean; message: string } | null>} Confirmation of deletion or null if an error occurs.
 *
 * @throws {Error} If the API returns an error or the deletion fails.
 *
 * @example
 * const result = await deleteEmployeeAction(employeeId);
 */
export const deleteEmployeeAction = async (
  employeeId: EmployeeInterface["id"]
): Promise<{ success: boolean; message: string } | null> => {
  try {
    logger.info("Delete employee attempt:", { employeeId });

    const api = new EmployeeDeleteApiConsumer(employeeId);
    const result = await api.request();

    if (result instanceof ApiError) {
      logger.error("Delete employee API error:", result.message);
      throw new Error(`Error while deleting employee: ${result.message}`);
    }

    logger.info("Employee deleted successfully:", result);
    return result;
  } catch (error) {
    logger.error("Delete employee error:", error);
    throw error;
  }
};
