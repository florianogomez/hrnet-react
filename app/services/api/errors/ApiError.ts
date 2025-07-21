import type { AxiosError } from "axios";

/**
 * Abstract base class for all API-related errors.
 *
 * This class should be extended by specific error types (e.g., NotFoundApiError, ForbiddenApiError).
 * It centralizes common properties like the HTTP status code, title, message, and additional data.
 *
 * @example
 * class MyCustomApiError extends ApiError {
 *   constructor() {
 *     super(400, 'Custom API Error', 'A custom error occurred.', { detail: '...' });
 *   }
 * }
 *
 * @category API Errors
 */
export default abstract class ApiError {
  /** HTTP status code associated with the error (e.g., 404, 500). */
  code: number;

  /** A short, human-readable summary of the error (e.g., 'Not Found', 'Validation Error'). */
  title: string;

  /** A detailed message explaining the error. */
  message: string;

  /** Additional data related to the error (e.g., context, validation errors). */
  data: any;

  /** Original Axios error if available, useful for debugging complex network errors. */
  axiosError?: AxiosError;

  /**
   * Creates a new custom API error instance.
   *
   * @param code - The HTTP status code for the error.
   * @param title - Title summarizing the error.
   * @param message - Detailed error message.
   * @param data - Additional contextual data.
   * @param axiosError - Optional original Axios error.
   */
  constructor(code: number, title = "API Error", message = "", data = {}, axiosError?: AxiosError) {
    this.axiosError = axiosError;
    this.code = code;
    this.title = title;
    this.message = message;
    this.data = data;
  }
}
