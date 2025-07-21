/**
 * Interface defining the structure of information associated with an API error.
 *
 * This interface standardizes data passed to custom errors
 * to ensure consistent error handling on the front-end.
 *
 * @interface ApiErrorDataInterface
 */
export interface ApiErrorDataInterface {
	/**
	 * @property {string} message
	 * The main error message to display or log.
	 */
	message: string;

	/**
	 * @property {Record<string, any>} [data]
	 * Optional additional data providing more context about the error.
	 * Typically used to detail validation errors or to pass enriched context.
	 *
	 * @example
	 * {
	 *   field: 'username',
	 *   issue: 'This username is already taken.'
	 * }
	 */
	data?: Record<string, any>;
}
