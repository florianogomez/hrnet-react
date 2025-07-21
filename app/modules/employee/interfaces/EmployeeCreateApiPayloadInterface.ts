/**
 * Interface representing the API payload for creating or updating an employee.
 * Contains all required properties for employee creation or update.
 */
export interface EmployeeCreateApiPayloadInterface {
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
}
