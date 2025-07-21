import { ApiResourceModel } from "~/services/api/models/ApiResourceModel";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";

/**
 * Model representing an employee.
 * Extends {@link ApiResourceModel} with employee-specific properties and methods.
 */
export class EmployeeModel extends ApiResourceModel implements EmployeeInterface {
  /** Employee's first name. */
  firstName: EmployeeInterface["firstName"];
  /** Employee's last name. */
  lastName: EmployeeInterface["lastName"];
  /** Employee's date of birth (YYYY-MM-DD). */
  dateOfBirth: EmployeeInterface["dateOfBirth"];
  /** Employee's start date (YYYY-MM-DD). */
  startDate: EmployeeInterface["startDate"];
  /** Employee's department. */
  department: EmployeeInterface["department"];
  /** Employee's street address. */
  street: EmployeeInterface["street"];
  /** Employee's city. */
  city: EmployeeInterface["city"];
  /** Employee's state or province (abbreviation). */
  state: EmployeeInterface["state"];
  /** Employee's zip or postal code. */
  zipCode: EmployeeInterface["zipCode"];

  /**
   * Creates a new instance of EmployeeModel.
   * @param data - The employee data.
   */
  constructor(data: EmployeeInterface) {
    super(data);
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.dateOfBirth = data.dateOfBirth || "";
    this.startDate = data.startDate || "";
    this.department = data.department || "";
    this.street = data.street || "";
    this.city = data.city || "";
    this.state = data.state || "";
    this.zipCode = data.zipCode || "";
  }

  /**
   * Returns the employee as an {@link EmployeeInterface} object.
   */
  get interface(): EmployeeInterface {
    return {
      ...super.interface,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      startDate: this.startDate,
      department: this.department,
      street: this.street,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode
    }
  }

  /**
   * Returns the employee's full name (first name + last name).
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Returns the employee's approximate age in years.
   */
  get age(): number {
    if (!this.dateOfBirth) return 0;
    const birthDate = new Date(this.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Returns the employee's full address as a single string.
   */
  get fullAddress(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}`.trim();
  }

  /**
   * Returns the formatted date of birth (localized string).
   */
  get dateOfBirthFormatted(): string {
    if (!this.dateOfBirth) return "";
    return new Date(this.dateOfBirth).toLocaleDateString();
  }

  /**
   * Returns the formatted start date (localized string).
   */
  get startDateFormatted(): string {
    if (!this.startDate) return "";
    return new Date(this.startDate).toLocaleDateString();
  }

  /**
   * Returns the number of years of service since the start date.
   */
  get yearsOfService(): number {
    if (!this.startDate) return 0;
    const startDate = new Date(this.startDate);
    const today = new Date();
    let years = today.getFullYear() - startDate.getFullYear();
    const monthDiff = today.getMonth() - startDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < startDate.getDate())) {
      years--;
    }
    return Math.max(0, years);
  }
}
