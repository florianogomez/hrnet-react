import type { ApiErrorDataInterface } from '../interfaces/ApiErrorDataInterface'
import type { ApiResponseInterface } from '../interfaces/ApiResponseInterface'
import ApiError from './ApiError'

/**
 * API error indicating that the requested resource was not found (HTTP 404).
 * Used when the server cannot find the resource specified by the URL.
 *
 * This error signals to the end user that a route or entity does not exist,
 * and can be used to display a 404 page or an appropriate error message.
 *
 * @example
 * throw new NotFoundApiError('/users/999', { message: 'User not found' });
 */
export default class NotFoundApiError extends ApiError {
  /**
   * Creates a new NotFoundApiError instance.
   *
   * @param route - The URL or identifier of the missing resource.
   * @param errorData - Object containing the custom message.
   * @param errorData.message - Message describing the error.
   */
  constructor(route: string, { message, status }: ApiResponseInterface) {
    const finalMessage = message || `The requested resource at URL [ ${route} ] was not found.`;
    super(404, 'Resource not found', finalMessage, status);
  }
}
