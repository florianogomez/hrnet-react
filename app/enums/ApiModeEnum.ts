/**
 * Enumeration of available API call modes.
 * Allows switching between mocked data and real API calls.
 */
enum ApiModeEnum {
	/**
	 * Development mode with simulated data.
	 * Used for development and testing without relying on a real API.
	 */
	MOCK = "mock",
	/**
	 * Production mode with real API calls.
	 * Used for the final release of the application.
	 */
	REAL = "real",
}

export { ApiModeEnum };
