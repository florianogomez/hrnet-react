import type { AxiosError } from 'axios';
import type { ApiErrorDataInterface } from '../interfaces/ApiErrorDataInterface'
import ApiError from './ApiError'

/**
 * Represents a generic API error capturing errors not covered by other specific types.
 * Typically used to catch network errors, malformed requests, timeouts, or other unknown errors.
 *
 * @example
 * try {
 *   await axios.get('/some-endpoint')
 * } catch (error) {
 *   throw new GeneralApiError(error, { message: 'An error occurred.', data: {} });
 * }
 */
export default class GeneralApiError extends ApiError {
  /**
   * Creates a new GeneralApiError instance from an Axios error.
   *
   * @param error - The caught Axios error object.
   * @param params - Additional error details to include.
   * @param params.message - The custom message to display if available.
   * @param params.data - Additional data associated with the error.
   */
  constructor(error: AxiosError, { message, data }: ApiErrorDataInterface) {
    super(error.response?.status || 0, "General API Error", message, data, error);

    // Determine a more specific message based on the Axios error code.
    switch (error.code) {
      case 'ERR_NETWORK':
        this.message = 'Network error';
        break;
      case 'ERR_BAD_REQUEST':
        this.message = 'Bad request';
        break;
      case 'ERR_TIMEOUT':
        this.message = 'Timeout exceeded';
        break;
      default:
        this.message = message || 'Unknown error';
        break;
    }
  }
}
