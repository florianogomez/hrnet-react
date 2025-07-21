/**
 * Enumeration of possible runtime environments for the application.
 * Used to adapt configuration based on the environment (development or production).
 */
enum EnvEnum {
	/**
	 * Development environment.
	 * Used for local development and testing.
	 */
	DEV = "development",
	/**
	 * Production environment.
	 * Used for automated and manual testing.
	 */
	PROD = "production",
}

export { EnvEnum };
