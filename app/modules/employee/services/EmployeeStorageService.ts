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
	 * Sauvegarde la liste complète des employés
	 * @param employees - Liste des employés à sauvegarder
	 * @param remember - Indique si les données doivent être persistées dans IndexedDB
	 */
	async setEmployees(employees: EmployeeInterface[], remember: boolean = true): Promise<void> {
		await this.storeEmployees(employees, remember);
	}

	/**
	 * Ajoute un nouvel employé
	 * @param employee - Employé à ajouter (modèle ou interface)
	 */
	async addEmployee(employee: EmployeeModel | EmployeeInterface): Promise<void> {
		try {
			// Définir l'état de chargement
			await this.setLoading(true);

			// Convertir en interface si c'est un modèle
			const employeeData = employee instanceof EmployeeModel ? 
				employee as unknown as EmployeeInterface : 
				employee;

			// Vérifier si l'employé existe déjà (même prénom et nom)
			const existingEmployee = await this.findEmployeeByName(employeeData.firstName, employeeData.lastName);
			if (existingEmployee) {
				const errorMsg = `Un employé avec le nom "${employeeData.firstName} ${employeeData.lastName}" existe déjà`;
				logger.warn(errorMsg);
				await this.setError(errorMsg);
				await this.setLoading(false);
				throw new Error(errorMsg);
			}

			// S'assurer que l'employé a un ID et des dates
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

			logger.info("Employé ajouté au stockage local", {
				id: newEmployee.id,
				name: `${newEmployee.firstName} ${newEmployee.lastName}`,
			});
			await this.setLoading(false);
		} catch (error) {
			await this.setLoading(false);
			const errorMsg = "Erreur lors de l'ajout de l'employé";
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			throw error;
		}
	}

	/**
	 * Met à jour un employé existant
	 * @param employee - Employé à mettre à jour (modèle ou interface avec ID)
	 */
	async updateEmployee(employee: EmployeeModel | EmployeeInterface): Promise<void> {
		try {
			await this.setLoading(true);

			// Convertir en interface si c'est un modèle
			const employeeData = employee instanceof EmployeeModel ? 
				employee as unknown as EmployeeInterface : 
				employee;

			if (!employeeData.id) {
				throw new Error("L'ID de l'employé est requis pour la mise à jour");
			}

			const employees = await this.getEmployees();
			const index = employees.findIndex(emp => emp.id === employeeData.id);
			
			if (index === -1) {
				const errorMsg = `Employé avec l'ID ${employeeData.id} non trouvé`;
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

			logger.info("Employé mis à jour dans le stockage local", {
				id: updatedEmployee.id,
				name: `${updatedEmployee.firstName} ${updatedEmployee.lastName}`,
			});
			await this.setLoading(false);
		} catch (error) {
			await this.setLoading(false);
			const errorMsg = "Erreur lors de la mise à jour de l'employé";
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			throw error;
		}
	}

	/**
	 * Met à jour un employé existant par ID et données partielles
	 * @param id - ID de l'employé
	 * @param updatedEmployee - Données mises à jour
	 */
	async updateEmployeeById(id: string, updatedEmployee: Partial<EmployeeInterface>): Promise<void> {
		try {
			await this.setLoading(true);

			const employees = await this.getEmployees();
			const index = employees.findIndex(emp => emp.id === id);
			
			if (index === -1) {
				const errorMsg = `Employé avec l'ID ${id} non trouvé`;
				logger.warn(errorMsg);
				await this.setError(errorMsg);
				await this.setLoading(false);
				throw new Error(errorMsg);
			}

			const updated: EmployeeInterface = {
				...employees[index],
				...updatedEmployee,
				id, // S'assurer que l'ID ne change pas
				updatedAt: new Date().toISOString(),
			};

			employees[index] = updated;
			await this.storeEmployees(employees);

			logger.info("Employé mis à jour dans le stockage local", {
				id: updated.id,
				name: `${updated.firstName} ${updated.lastName}`,
			});
			await this.setLoading(false);
		} catch (error) {
			await this.setLoading(false);
			const errorMsg = "Erreur lors de la mise à jour de l'employé";
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			throw error;
		}
	}

	/**
	 * Supprime un employé
	 * @param id - ID de l'employé à supprimer
	 */
	async deleteEmployee(id: string): Promise<void> {
		try {
			await this.setLoading(true);

			const employees = await this.getEmployees();
			const employeeIndex = employees.findIndex(emp => emp.id === id);
			
			if (employeeIndex === -1) {
				const errorMsg = `Employé avec l'ID ${id} non trouvé`;
				logger.warn(errorMsg);
				await this.setError(errorMsg);
				await this.setLoading(false);
				throw new Error(errorMsg);
			}

			const deletedEmployee = employees[employeeIndex];
			const filteredEmployees = employees.filter(emp => emp.id !== id);
			
			await this.storeEmployees(filteredEmployees);

			logger.info("Employé supprimé du stockage local", {
				id: deletedEmployee.id,
				name: `${deletedEmployee.firstName} ${deletedEmployee.lastName}`,
			});
			await this.setLoading(false);
		} catch (error) {
			await this.setLoading(false);
			const errorMsg = "Erreur lors de la suppression de l'employé";
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			throw error;
		}
	}

	/**
	 * Récupère un employé par son ID
	 * @param id - ID de l'employé
	 * @returns Promise<EmployeeInterface | null>
	 */
	async getEmployeeById(id: string): Promise<EmployeeInterface | null> {
		try {
			const employees = await this.getEmployees();
			return employees.find(emp => emp.id === id) || null;
		} catch (error) {
			const errorMsg = `Erreur lors de la récupération de l'employé avec ID "${id}"`;
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			return null;
		}
	}

	/**
	 * Trouve un employé par son ID et retourne un modèle
	 * @param id - ID de l'employé recherché
	 * @returns L'employé trouvé en tant que modèle ou null si non trouvé
	 */
	async findEmployeeById(id: EmployeeInterface["id"]): Promise<EmployeeModel | null> {
		try {
			const employees = await this.getEmployees();
			if (!employees.length) return null;

			const employee = employees.find((item) => item.id === id);
			if (!employee) {
				logger.debug(`Employé avec ID "${id}" non trouvé`);
				return null;
			}

			logger.debug(`Employé avec ID "${id}" trouvé`);
			return new EmployeeModel(employee);
		} catch (error) {
			const errorMsg = `Erreur lors de la recherche de l'employé avec ID "${id}"`;
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			return null;
		}
	}

	/**
	 * Trouve un employé par prénom et nom
	 * @param firstName - Prénom de l'employé recherché
	 * @param lastName - Nom de l'employé recherché
	 * @returns L'employé trouvé ou null si non trouvé
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
				logger.debug(`Employé avec nom "${firstName} ${lastName}" non trouvé`);
				return null;
			}

			logger.debug(`Employé avec nom "${firstName} ${lastName}" trouvé`);
			return new EmployeeModel(employee);
		} catch (error) {
			const errorMsg = `Erreur lors de la recherche de l'employé avec nom "${firstName} ${lastName}"`;
			logger.error(errorMsg, error);
			await this.setError(errorMsg);
			return null;
		}
	}

	/**
	 * Sauvegarde un employé qui vient d'être ajouté (pour référence)
	 * @param employee - Employé ajouté
	 */
	async setEmployeeJustAdded(employee: EmployeeInterface): Promise<void> {
		try {
			const storageKey = this.computeStorageKey(EmployeeStorageKeyEnum.EMPLOYEE_JUST_ADDED);
			await AppIndexedDBStorage.set(storageKey, employee);
			logger.debug("Employé récemment ajouté sauvegardé dans IndexedDB");
		} catch (error) {
			logger.error("Erreur lors de la sauvegarde de l'employé ajouté:", error);
		}
	}

	/**
	 * Récupère l'employé qui vient d'être ajouté
	 * @returns Promise<EmployeeInterface | null>
	 */
	async getEmployeeJustAdded(): Promise<EmployeeInterface | null> {
		try {
			const storageKey = this.computeStorageKey(EmployeeStorageKeyEnum.EMPLOYEE_JUST_ADDED);
			return await AppIndexedDBStorage.get<EmployeeInterface>(storageKey);
		} catch (error) {
			logger.error("Erreur lors de la récupération de l'employé ajouté:", error);
			return null;
		}
	}

	/**
	 * Supprime la référence de l'employé qui vient d'être ajouté
	 */
	async clearEmployeeJustAdded(): Promise<void> {
		try {
			const storageKey = this.computeStorageKey(EmployeeStorageKeyEnum.EMPLOYEE_JUST_ADDED);
			await AppIndexedDBStorage.remove(storageKey);
			logger.debug("Référence de l'employé récemment ajouté supprimée");
		} catch (error) {
			logger.error("Erreur lors de la suppression de l'employé ajouté:", error);
		}
	}
}

/**
 * Singleton instance of the EmployeeStorageService.
 */
export const employeeStorageService = new EmployeeStorageService();
