/**
 * Enum of storage keys for the employee module.
 * These keys are used in EmployeeStorageService to store and retrieve employee-related data.
 */
export enum EmployeeStorageKeyEnum {
  /**
   * Key for the list of employees.
   */
  EMPLOYEES = "employees",

  /**
   * Key for the employee that was just added.
   */
  EMPLOYEE_JUST_ADDED = "employee_just_added",

  /**
   * Key for employee drafts.
   * Used as a prefix; the draft ID is appended to this key.
   */
  EMPLOYEE_DRAFT = "employee_draft",

  /**
   * Key for employee filters.
   */
  EMPLOYEE_FILTERS = "employee_filters",

  /**
   * Key for the loading state of employees.
   */
  EMPLOYEE_LOADING = "employee_loading",

  /**
   * Key for errors related to employees.
   */
  EMPLOYEE_ERROR = "employee_error",
}
