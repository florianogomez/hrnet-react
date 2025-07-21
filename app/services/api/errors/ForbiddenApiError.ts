import type { ApiErrorDataInterface } from '../interfaces/ApiErrorDataInterface'
import ApiError from './ApiError'

/**
 * Represents a forbidden access error (HTTP 403).
 *
 * This error is used when the server understands the request but refuses to execute it,
 * typically due to insufficient permissions or access restrictions.
 *
 * @example
 * throw new ForbiddenApiError({ message: 'Access denied to this resource.', data: { requiredRole: 'admin' } });
 */
export default class ForbiddenApiError extends ApiError {
  /**
   * Creates a new ForbiddenApiError instance.
   *
   * @param params - The error parameters.
   * @param params.message - The message describing the reason for the denial.
   * @param params.data - Additional data associated with the error.
   */
  constructor({ message, data }: ApiErrorDataInterface) {
    super(403, 'Accès interdit', message, data)
  }
}
