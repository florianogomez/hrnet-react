import type { ApiErrorDataInterface } from '../interfaces/ApiErrorDataInterface'
import type { ApiResponseInterface } from '../interfaces/ApiResponseInterface'
import ApiError from './ApiError'

/**
 * Specific API error indicating a resource conflict (HTTP 409).
 *
 * Use this error when the request cannot be processed due to a conflict with the current state of the target resource.
 * For example, when attempting to create a resource that already exists.
 *
 * @example
 * throw new ConflictApiError({ message: 'User already exists.' });
 */
export default class ConflictApiError extends ApiError {
  /**
   * Creates a new ConflictApiError instance.
   * @param params - The error parameters.
   * @param params.message - The specific error message.
   */
  constructor({ message, status }: ApiResponseInterface) {
    super(409, 'Resource conflict', message, status);
  }
}
