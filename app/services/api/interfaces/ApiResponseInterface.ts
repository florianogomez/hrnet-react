/**
 * Generic interface for API responses.
 * Provides a standardized structure for all API responses in the application.
 * 
 * @interface ApiResponseInterface
 * @template T - The type of the response body data (defaults to any).
 * @property {number} status - HTTP status code of the response.
 * @property {string} message - Human-readable message describing the response status.
 * @property {T} [body] - Optional response payload containing the requested data.
 * @example
 * // Successful login response
 * const loginResponse: ApiResponseInterface<{token: string}> = {
 *   status: 200,
 *   message: "Login successful",
 *   body: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 * };
 * 
 * // Error response
 * const errorResponse: ApiResponseInterface = {
 *   status: 400,
 *   message: "Invalid email or password"
 * };
 */
export interface ApiResponseInterface<T=any> {
  status: number;
  message: string;
  body?: T;
}
