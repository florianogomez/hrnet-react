import type { EmployeeInterface } from "./interfaces/EmployeeInterface";

const prefix = "/employees"

/**
 * Object containing all route paths for the Employee module.
 *
 * @property list - Path to the employee list view.
 * @property add - Path to the add employee view.
 * @property edit - Function returning the path to the edit employee view for a given employee ID.
 * @property view - Function returning the path to the view employee details for a given employee ID.
 */
export const employeeRoutes = {
	   /** Path to the employee list view. */
	   list: `${prefix}`,

	   /** Path to the add employee view. */
	   add: `${prefix}/add`,

	   /**
		* Returns the path to the edit employee view for a given employee ID.
		* @param employeeId - The ID of the employee to edit.
		* @returns The edit route path.
		*/
	   edit: (employeeId: EmployeeInterface["id"]) => `${prefix}/edit/${employeeId}`,

	   /**
		* Returns the path to the view employee details for a given employee ID.
		* @param employeeId - The ID of the employee to view.
		* @returns The view route path.
		*/
	   view: (employeeId: EmployeeInterface["id"]) => `${prefix}/view/${employeeId}`,

} as const;

export default employeeRoutes;
