/**
 * Base interface for API resources.
 * Defines common fields that all API resources should have.
 * 
 * @interface ApiResourceInterface
 * @property {string} id - Unique identifier for the resource
 * @property {string} [created_at] - ISO timestamp when the resource was created
 * @property {string} [updated_at] - ISO timestamp when the resource was last updated
 * @property {string} [deleted_at] - ISO timestamp when the resource was soft deleted (optional)
 * @property {string} [created_by] - ID of the user who created the resource (optional)
 * @property {string} [updated_by] - ID of the user who last updated the resource (optional)
 * @property {string} [deleted_by] - ID of the user who deleted the resource (optional)
 * @example
 * interface EmployeeInterface extends ApiResourceInterface {
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 * }
 */
export interface ApiResourceInterface {
  id: string; // Unique identifier for the resource
  created_at?: string;
  updated_at?: string;
  deleted_at?: string; // Optional field for soft deletion
  created_by?: string; // Optional field for tracking who created the resource
  updated_by?: string; // Optional field for tracking who last updated the resource
  deleted_by?: string; // Optional field for tracking who deleted the resource
}
