// For generating mock employees
// Installer faker si besoin : npm install @faker-js/faker
import { faker } from '@faker-js/faker';


import { useCallback } from "react";
import { useAppDispatch } from "~/store/hooks/useAppDispatch";
import { useAppSelector } from "~/store/hooks/useAppSelector";
import { 
  setEmployeesLoading,
  setEmployees,
  addEmployee as addEmployeeAction,
  setEmployeeError
} from "../store/employees_slice";
import { 
  createEmployeeAction,
  getEmployeesAction,
  findEmployeeAction
} from "../actions";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import type { EmployeeCreateApiPayloadInterface } from "../interfaces/EmployeeCreateApiPayloadInterface";
import { createLogger } from "~/utils/logger";

const logger = createLogger("useEmployeeList");

/**
 * Custom React hook to manage the employee list.
 * Provides CRUD functions and Redux state for employees.
 *
 * @returns An object containing employee state and main actions.
 */
export const useEmployeeList = () => {
	const dispatch = useAppDispatch();
	const { employees, processing: loading, error } = useAppSelector((state) => state.employee);

	/**
 * Generates and adds 173 mock employees for performance testing.
 * Can be enabled/disabled via the enable parameter.
 * @param enable - Whether to enable mock generation (default false)
	 */
	const generateMockEmployees = useCallback(
		async () => {

			for (let i = 0; i < 173; i++) {
				const fakeEmployee = {
					firstName: faker.person.firstName(),
					lastName: faker.person.lastName(),
					dateOfBirth: faker.date
						.birthdate({ min: 1960, max: 2002, mode: "year" })
						.toISOString()
						.slice(0, 10),
					startDate: faker.date.past({ years: 10 }).toISOString().slice(0, 10),
					department: faker.commerce.department(),
					street: faker.location.streetAddress(),
					city: faker.location.city(),
					state: faker.location.state(),
					zipCode: faker.location.zipCode(),
				} as EmployeeCreateApiPayloadInterface;
				await createEmployeeAction(fakeEmployee);
			}
	  logger.info("173 mock employees generated");
		},
		[createEmployeeAction]
	);

	/**
	 * Loads all employees from the API and updates the Redux state.
	 * Handles loading and error state.
	 */
	const loadEmployees = useCallback(async () => {
		try {
			dispatch(setEmployeesLoading(true));
			dispatch(setEmployeeError(null));
	  // await generateMockEmployees();
			const result = await getEmployeesAction();
			if (result) {
				// Convert models to interfaces for Redux
				const employeesList = result.map((model) => model.interface);
				dispatch(setEmployees(employeesList));
				logger.info(`Loaded ${employeesList.length} employees`);
			}
		} catch (error) {
			logger.error("Error loading employees:", error);
			dispatch(setEmployeeError("Failed to load employees"));
		} finally {
			dispatch(setEmployeesLoading(false));
		}
	}, [dispatch]);

	/**
	 * Adds a new employee using the API and updates the Redux state.
	 * Handles loading and error state.
	 * @param employeeData - The data for the new employee.
	 * @returns The new employee interface or null if failed.
	 */
	const addEmployee = useCallback(
		async (employeeData: EmployeeCreateApiPayloadInterface): Promise<EmployeeInterface | null> => {
			try {
				dispatch(setEmployeesLoading(true));
				dispatch(setEmployeeError(null));
				const result = await createEmployeeAction(employeeData);
				if (result) {
					const newEmployee = result.interface;
					dispatch(addEmployeeAction(newEmployee));
					logger.info(`Added employee: ${newEmployee.firstName} ${newEmployee.lastName}`);
					return newEmployee;
				}
				return null;
			} catch (error) {
				logger.error("Error adding employee:", error);
				dispatch(setEmployeeError("Failed to add employee"));
				return null;
			} finally {
				dispatch(setEmployeesLoading(false));
			}
		},
		[dispatch]
	);

	/**
	 * Gets an employee by their ID using the API.
	 * @param id - The ID of the employee to retrieve.
	 * @returns The employee interface or null if not found.
	 */
	const getEmployeeById = useCallback(async (id: string): Promise<EmployeeInterface | null> => {
		try {
			const result = await findEmployeeAction(id);
			return result ? result.interface : null;
		} catch (error) {
			logger.error("Error getting employee by ID:", error);
			return null;
		}
	}, []);

	return {
		/**
		 * List of employees from Redux state.
		 */
		employees,
		/**
		 * Loading state for employee actions.
		 */
		loading,
		/**
		 * Error state for employee actions.
		 */
		error,
		/**
		 * Loads all employees from the API.
		 */
		loadEmployees,
		/**
		 * Adds a new employee.
		 */
		addEmployee,
		/**
		 * Gets an employee by ID.
		 */
		getEmployeeById,
		/**
		 * Génère et ajoute 173 employés mockés (pour tests de perf).
		 * @param enable Active ou non la génération
		 */
		generateMockEmployees,
	};
};
