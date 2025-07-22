import { AppStorageService } from "~/services/storages/AppStorageService";
import AppIndexedDBStorage from "~/services/storages/AppIndexedDBStorage";
import { EmployeeStorageKeyEnum } from "../enums/EmployeeStorageKeyEnum";
import { store, type RootState } from "~/store";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import type { EmployeeCreateApiPayloadInterface } from "../interfaces/EmployeeCreateApiPayloadInterface";
import { EmployeeModel } from "../models";
import { createLogger } from "~/utils/logger";
import { setEmployees, setEmployeesLoading, setEmployeeError } from "../store/employees_slice";

const logger = createLogger("EmployeeStorageService");

/**
 * Storage service for the employee module.
 * Handles persistence and retrieval of employee data in IndexedDB and Redux store.
 */
export class EmployeeStorageService extends AppStorageService {
	   /**
		* Creates a new instance of EmployeeStorageService.
		*/
	   constructor() {
			   super({ name: "employees" });
	   }

	   /**
		* Redux sync configuration for the employee list.
		* @private
		*/
	   private get employeesReduxSync() {
			   return {
					   selector: (state: RootState) => state.employee.employees || [],
					   action: (payload: EmployeeInterface[] | null) => setEmployees(payload || []),
			   };
	   }

	   /**
		* Redux sync configuration for the loading state.
		* @private
		*/
	   private get loadingReduxSync() {
			   return {
					   selector: (state: RootState) => state.employee.processing || false,
					   action: (payload: boolean | null) => setEmployeesLoading(payload || false),
			   };
	   }

	   /**
		* Redux sync configuration for the error state.
		* @private
		*/
	   private get errorReduxSync() {
			   return {
					   selector: (state: RootState) => state.employee.error || null,
					   action: (payload: string | null) => setEmployeeError(payload),
			   };
	   }

	   /**
		* Sets the loading state in Redux.
		* @param isLoading - Loading state value.
		*/
	   async setLoading(isLoading: boolean): Promise<void> {
			   try {
					   store.dispatch(this.loadingReduxSync.action(isLoading));
					   logger.debug(`Loading state updated in Redux: ${isLoading}`);
			   } catch (error) {
					   logger.error("Error setting loading state", error);
			   }
	   }

	   /**
		* Sets an error message in Redux.
		* @param errorMessage - Error message or null to clear.
		*/
	   async setError(errorMessage: string | null): Promise<void> {
			   try {
					   store.dispatch(this.errorReduxSync.action(errorMessage));
					   logger.debug(`Error message updated in Redux: ${errorMessage}`);
			   } catch (error) {
					   logger.error("Error setting error message", error);
			   }
	   }

	   /**
		* Stores the list of employees in Redux and optionally in IndexedDB.
		* @param payload - List of employees to store.
		* @param remember - Whether to persist data in IndexedDB (default: true).
		*/
	   async storeEmployees(payload: EmployeeInterface[], remember: boolean = true): Promise<void> {
			   try {
					   // Update Redux
					   store.dispatch(this.employeesReduxSync.action(payload || []));
					   logger.debug(`Data dispatched to Redux for key "employees"`);

					   // Persist in IndexedDB if requested
					   if (remember) {
							   const storageKey = this.computeStorageKey(EmployeeStorageKeyEnum.EMPLOYEES);
							   await AppIndexedDBStorage.set(storageKey, payload);
							   logger.debug(`Value persisted in IndexedDB for "employees"`);
					   }

					   logger.info("Employee list stored", { count: payload?.length });

					   // Clear previous errors
					   await this.setError(null);
			   } catch (error) {
					   const errorMsg = "Error storing employee list";
					   logger.error(errorMsg, error);
					   await this.setError(errorMsg);
					   throw error;
			   }
	   }
	   /**
		* Retrieves all employees from storage (IndexedDB) and syncs with Redux.
		* @returns Promise resolving to the list of employees.
		*/
	   async getEmployees(): Promise<EmployeeInterface[]> {
			   try {
					   // Direct retrieval from IndexedDB
					   const storageKey = this.computeStorageKey(EmployeeStorageKeyEnum.EMPLOYEES);
					   const employees = await AppIndexedDBStorage.get<EmployeeInterface[]>(storageKey);

					   if (employees) {
							   logger.debug("Employee list retrieved", { count: employees.length });
							   // Sync with Redux only
							   store.dispatch(this.employeesReduxSync.action(employees));
							   return employees;
					   } else {
							   logger.debug("No employee list found");
							   const emptyList: EmployeeInterface[] = [];
							   store.dispatch(this.employeesReduxSync.action(emptyList));
							   return emptyList;
					   }
			   } catch (error) {
					   const errorMsg = "Error retrieving employee list";
					   logger.error(errorMsg, error);
					   await this.setError(errorMsg);
					   return [];
			   }
	   }

   /**
	* Saves the complete list of employees
	* @param employees - List of employees to save
	* @param remember - Whether the data should be persisted in IndexedDB
	*/
	async setEmployees(employees: EmployeeInterface[], remember: boolean = true): Promise<void> {
		await this.storeEmployees(employees, remember);
	}

   /**
	* Adds a new employee
	* @param employee - Employee to add (model or interface)
	*/
   async addEmployee(employee: EmployeeModel | EmployeeInterface): Promise<void> {
		try {
		   // Set loading state
		   await this.setLoading(true);

		   // Convert to interface if it's a model
			const employeeData = employee instanceof EmployeeModel ? 
				employee as unknown as EmployeeInterface : 
				employee;

		   // Check if employee already exists (same first and last name)
		   const existingEmployee = await this.findEmployeeByName(employeeData.firstName, employeeData.lastName);
		   if (existingEmployee) {
			   const errorMsg = `An employee with the name "${employeeData.firstName} ${employeeData.lastName}" already exists`;
			   logger.warn(errorMsg);
			   await this.setError(errorMsg);
			   await this.setLoading(false);
			   throw new Error(errorMsg);
		   }

		   // Ensure the employee has an ID and dates
			const newEmployee: EmployeeInterface = {
				...employeeData,
				id: employeeData.id || Date.now().toString(),
				createdAt: employeeData.createdAt || new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			const currentEmployees = await this.getEmployees();
			const updatedEmployees = [...currentEmployees, newEmployee];
			await this.storeEmployees(updatedEmployees);
			await this.setEmployeeJustAdded(newEmployee);

		   logger.info("Employee added to local storage", {
			   id: newEmployee.id,
			   name: `${newEmployee.firstName} ${newEmployee.lastName}`,
		   });
			await this.setLoading(false);
		} catch (error) {
			await this.setLoading(false);
			const errorMsg = "Error while adding employee";
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			throw error;
		}
	}

   /**
	* Updates an existing employee
	* @param employee - Employee to update (model or interface with ID)
	*/
	async updateEmployee(employee: EmployeeModel | EmployeeInterface): Promise<void> {
		try {
			await this.setLoading(true);

		   // Convert to interface if it's a model
			const employeeData = employee instanceof EmployeeModel ? 
				employee as unknown as EmployeeInterface : 
				employee;

		   if (!employeeData.id) {
			   throw new Error("Employee ID is required for update");
		   }

			const employees = await this.getEmployees();
			const index = employees.findIndex(emp => emp.id === employeeData.id);
			
		   if (index === -1) {
			   const errorMsg = `Employee with ID ${employeeData.id} not found`;
			   logger.warn(errorMsg);
			   await this.setError(errorMsg);
			   await this.setLoading(false);
			   throw new Error(errorMsg);
		   }

			const updatedEmployee: EmployeeInterface = {
				...employees[index],
				...employeeData,
				updatedAt: new Date().toISOString(),
			};

			// Correction : copie du tableau avant modification
			const updatedEmployees = [...employees];
			updatedEmployees[index] = updatedEmployee;
			await this.storeEmployees(updatedEmployees);

		   logger.info("Employee updated in local storage", {
			   id: updatedEmployee.id,
			   name: `${updatedEmployee.firstName} ${updatedEmployee.lastName}`,
		   });
			await this.setLoading(false);
		} catch (error) {
			await this.setLoading(false);
			const errorMsg = "Error while updating employee";
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			throw error;
		}
	}

   /**
	* Updates an existing employee by ID and partial data
	* @param id - Employee ID
	* @param updatedEmployee - Updated data
	*/
	async updateEmployeeById(id: string, updatedEmployee: Partial<EmployeeInterface>): Promise<void> {
		try {
			await this.setLoading(true);

			const employees = await this.getEmployees();
			const index = employees.findIndex(emp => emp.id === id);
			
		   if (index === -1) {
			   const errorMsg = `Employee with ID ${id} not found`;
			   logger.warn(errorMsg);
			   await this.setError(errorMsg);
			   await this.setLoading(false);
			   throw new Error(errorMsg);
		   }

			const updated: EmployeeInterface = {
				...employees[index],
				...updatedEmployee,
			   id, // Ensure the ID does not change
				updatedAt: new Date().toISOString(),
			};

			employees[index] = updated;
			await this.storeEmployees(employees);

		   logger.info("Employee updated in local storage", {
			   id: updated.id,
			   name: `${updated.firstName} ${updated.lastName}`,
		   });
			await this.setLoading(false);
		} catch (error) {
			await this.setLoading(false);
			const errorMsg = "Error while updating employee";
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			throw error;
		}
	}

   /**
	* Deletes an employee
	* @param id - ID of the employee to delete
	*/
	async deleteEmployee(id: string): Promise<void> {
		try {
			await this.setLoading(true);

			const employees = await this.getEmployees();
			const employeeIndex = employees.findIndex(emp => emp.id === id);
			
		   if (employeeIndex === -1) {
			   const errorMsg = `Employee with ID ${id} not found`;
			   logger.warn(errorMsg);
			   await this.setError(errorMsg);
			   await this.setLoading(false);
			   throw new Error(errorMsg);
		   }

			const deletedEmployee = employees[employeeIndex];
			const filteredEmployees = employees.filter(emp => emp.id !== id);
			
			await this.storeEmployees(filteredEmployees);

		   logger.info("Employee deleted from local storage", {
			   id: deletedEmployee.id,
			   name: `${deletedEmployee.firstName} ${deletedEmployee.lastName}`,
		   });
			await this.setLoading(false);
		} catch (error) {
			await this.setLoading(false);
			const errorMsg = "Error while deleting employee";
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			throw error;
		}
	}

   /**
	* Retrieves an employee by ID
	* @param id - Employee ID
	* @returns Promise<EmployeeInterface | null>
	*/
	async getEmployeeById(id: string): Promise<EmployeeInterface | null> {
		try {
			const employees = await this.getEmployees();
			return employees.find(emp => emp.id === id) || null;
		} catch (error) {
			const errorMsg = `Error while retrieving employee with ID "${id}"`;
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			return null;
		}
	}

   /**
	* Finds an employee by ID and returns a model
	* @param id - ID of the employee to find
	* @returns The found employee as a model or null if not found
	*/
	async findEmployeeById(id: EmployeeInterface["id"]): Promise<EmployeeModel | null> {
		try {
			const employees = await this.getEmployees();
			if (!employees.length) return null;

			const employee = employees.find((item) => item.id === id);
		   if (!employee) {
			   logger.debug(`Employee with ID "${id}" not found`);
			   return null;
		   }

		   logger.debug(`Employee with ID "${id}" found`);
		   return new EmployeeModel(employee);
		} catch (error) {
			const errorMsg = `Error while searching for employee with ID "${id}"`;
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			return null;
		}
	}

   /**
	* Finds an employee by first and last name
	* @param firstName - First name of the employee to find
	* @param lastName - Last name of the employee to find
	* @returns The found employee or null if not found
	*/
	async findEmployeeByName(firstName: string, lastName: string): Promise<EmployeeModel | null> {
		try {
			const employees = await this.getEmployees();
			if (!employees.length) return null;

			const employee = employees.find((item) => 
				item.firstName.toLowerCase() === firstName.toLowerCase() && 
				item.lastName.toLowerCase() === lastName.toLowerCase()
			);
		   if (!employee) {
			   logger.debug(`Employee with name "${firstName} ${lastName}" not found`);
			   return null;
		   }

		   logger.debug(`Employee with name "${firstName} ${lastName}" found`);
		   return new EmployeeModel(employee);
		} catch (error) {
			const errorMsg = `Error while searching for employee with name "${firstName} ${lastName}"`;
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			return null;
		}
	}

   /**
	* Saves an employee that was just added (for reference)
	* @param employee - Added employee
	*/
	async setEmployeeJustAdded(employee: EmployeeInterface): Promise<void> {
		try {
			const storageKey = this.computeStorageKey(EmployeeStorageKeyEnum.EMPLOYEE_JUST_ADDED);
			await AppIndexedDBStorage.set(storageKey, employee);
		   logger.debug("Recently added employee saved in IndexedDB");
		} catch (error) {
		   logger.error("Error while saving added employee:", error);
		}
	}

   /**
	* Retrieves the employee that was just added
	* @returns Promise<EmployeeInterface | null>
	*/
	async getEmployeeJustAdded(): Promise<EmployeeInterface | null> {
		try {
			const storageKey = this.computeStorageKey(EmployeeStorageKeyEnum.EMPLOYEE_JUST_ADDED);
			return await AppIndexedDBStorage.get<EmployeeInterface>(storageKey);
		} catch (error) {
			logger.error("Error while retrieving added employee:", error);
			return null;
		}
	}

   /**
	* Deletes the reference to the employee that was just added
	*/
	async clearEmployeeJustAdded(): Promise<void> {
		try {
			const storageKey = this.computeStorageKey(EmployeeStorageKeyEnum.EMPLOYEE_JUST_ADDED);
			await AppIndexedDBStorage.remove(storageKey);
		   logger.debug("Reference to recently added employee deleted");
		} catch (error) {
			logger.error("Error while deleting added employee:", error);
		}
	}
}

/**
 * Singleton instance of the EmployeeStorageService.
 */
export const employeeStorageService = new EmployeeStorageService();
