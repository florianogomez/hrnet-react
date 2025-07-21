import type { ApiErrorDataInterface } from '../interfaces/ApiErrorDataInterface'
import type { ApiResponseInterface } from '../interfaces/ApiResponseInterface';
import ApiError from './ApiError'

/**
 * Represents an authentication error due to missing or invalid credentials (HTTP 401).
 *
 * This error is used when the server refuses to execute a request because the user
 * is not authenticated. It is typically thrown when a token is missing or invalid.
 *
 * @example
 * throw new UnauthorizedApiError({ message: 'Missing or invalid token.' });
 */
export default class UnauthorizedApiError extends ApiError {
  /**
   * Creates a new UnauthorizedApiError instance.
   *
   * @param params - The error parameters.
   * @param params.message - A descriptive message indicating the reason for the authentication failure.
   */
  constructor({ message, status }: ApiResponseInterface) {
	super(401, "Authentication Required", message, status);
  }
}
