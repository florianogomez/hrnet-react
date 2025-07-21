/**
 * Interface representing an employee with personal and professional information.
 */
export interface EmployeeInterface {
  /**
   * Unique identifier for the employee.
   */
  id: string;

  /**
   * Employee's first name.
   */
  firstName: string;

  /**
   * Employee's last name.
   */
  lastName: string;

  /**
   * Date of birth (format YYYY-MM-DD).
   */
  dateOfBirth: string;

  /**
   * Start date of employment (format YYYY-MM-DD).
   */
  startDate: string;

  /**
   * Employee's department.
   */
  department: string;

  /**
   * Street address.
   */
  street: string;

  /**
   * City of the address.
   */
  city: string;

  /**
   * State or province (abbreviation).
   */
  state: string;

  /**
   * Zip or postal code.
   */
  zipCode: string;

  /**
   * Record creation date (ISO string, optional).
   */
  createdAt?: string;

  /**
   * Last modification date (ISO string, optional).
   */
  updatedAt?: string;
}
