import type { ApiErrorDataInterface } from '../interfaces/ApiErrorDataInterface'
import type { ApiResponseInterface } from '../interfaces/ApiResponseInterface';
import ApiError from './ApiError'

/**
 * Represents a bad request error (HTTP 400).
 *
 * This error is used when the server cannot process the request due to client error (e.g., validation failure).
 *
 * @example
 * throw new BadRequestApiError({ message: 'Invalid input.' });
 */
export default class BadRequestApiError extends ApiError {
  /**
   * Creates a new BadRequestApiError instance.
   *
   * @param params - The error parameters.
   * @param params.message - A descriptive message indicating the reason for the bad request.
   */
  constructor({ message, status }: ApiResponseInterface) {
	super(400, "Bad Request", message, status);
  }
}
