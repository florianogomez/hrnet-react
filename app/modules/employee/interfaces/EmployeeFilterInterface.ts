/**
 * Interface representing the filters for employee search queries.
 */
export interface EmployeeFilterInterface {
  /**
   * General search term to filter employees by any field.
   */
  searchTerm?: string;

  /**
   * Filter by department.
   */
  department?: string;

  /**
   * Filter by state.
   */
  state?: string;

  /**
   * Minimum start date (format YYYY-MM-DD).
   */
  startDateFrom?: string;

  /**
   * Maximum start date (format YYYY-MM-DD).
   */
  startDateTo?: string;

  /**
   * Field to sort by (must be a key of EmployeeInterface).
   */
  sortField?: keyof import('./EmployeeInterface').EmployeeInterface;

  /**
   * Sort direction: ascending ('asc') or descending ('desc').
   */
  sortDirection?: 'asc' | 'desc';

  /**
   * Number of items per page (pagination limit).
   */
  limit?: number;

  /**
   * Offset for pagination (number of items to skip).
   */
  offset?: number;
}
