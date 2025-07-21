import type { ApiErrorDataInterface } from '../interfaces/ApiErrorDataInterface'
import type { ApiResponseInterface } from '../interfaces/ApiResponseInterface';
import ApiError from './ApiError'

/**
 * Represents an internal server error (HTTP 500).
 *
 * This error is typically returned when the server encounters an unexpected condition
 * that prevents it from fulfilling the request.
 *
 * @example
 * throw new InternalServerApiError({ message: 'Critical error occurred during processing.' });
 */
export default class InternalServerApiError extends ApiError {
  /**
   * Initializes a new instance of InternalServerApiError.
   *
   * @param params - Object containing the error message.
   * @param params.message - Custom error message provided by the backend.
   */
  constructor({ message, status }: ApiResponseInterface) {
	super(500, "Internal Error", message, status);
  }
}
