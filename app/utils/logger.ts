/** Global configuration for the application (environment, etc.) */
import config from "~/config";
import { type ConsolaInstance, createConsola, LogLevels } from "consola/basic";
/** Enumeration representing the different environments of the application */
import { EnvEnum } from "~/enums/EnvEnum";

/**
 * Logging class to output different log levels based on the environment.
 * Disabled automatically in production.
 */
export class Logger {
	/** Internal consola instance for log management */
	private logger: ConsolaInstance;
	/** Indicates whether the logger is enabled (disabled in production) */
	private isEnabled: boolean;
	/** The scope (module/section name) for this logger */
	private scope: string;

	/**
	 * Creates a new logger instance with the specified scope.
	 * @param scope - The module or section name for this logger (default: "APP").
	 */
	constructor({ scope = "APP" } = {}) {
		this.logger = createConsola({ level: LogLevels.verbose });
		this.isEnabled = config.env !== EnvEnum.PROD;
		this.scope = scope;
	}

	/**
	 * Logs an informational message.
	 * @param message - The message to log.
	 * @param args - Additional arguments to include.
	 */
	info(message: string, ...args: any[]): void {
		if (this.isEnabled) this.logger.info(`[${this.scope}]`, message, ...args);
	}

	/**
	 * Logs a success message.
	 * @param message - The message to log.
	 * @param args - Additional arguments to include.
	 */
	success(message: string, ...args: any[]): void {
		if (this.isEnabled) this.logger.success(`[${this.scope}]`, message, ...args);
	}

	/**
	 * Logs a warning message.
	 * @param message - The message to log.
	 * @param args - Additional arguments to include.
	 */
	warn(message: string, ...args: any[]): void {
		if (this.isEnabled) this.logger.warn(`[${this.scope}]`, message, ...args);
	}

	/**
	 * Logs an error message.
	 * @param message - The message to log.
	 * @param args - Additional arguments to include.
	 */
	error(message: string, ...args: any[]): void {
		if (this.isEnabled) this.logger.error(`[${this.scope}]`, message, ...args);
	}

	/**
	 * Logs a debug message.
	 * @param message - The message to log.
	 * @param args - Additional arguments to include.
	 */
	debug(message: string, ...args: any[]): void {
		if (this.isEnabled) {
			this.logger.debug(`[${this.scope}]`, message, ...args);
		}
	}
}

/**
 * Global application logger ready to use.
 * Disabled automatically in production.
 */
export const appLogger = new Logger({ scope: "Argent Bank" });

/**
 * Creates a new logger with a custom scope.
 * @param scope - The name of the module or section for this logger.
 * @returns A Logger instance with the specified scope.
 * @example
 * const apiLogger = createLogger('API');
 * apiLogger.info('Request received'); // Logs: [API] Request received
 */
export const createLogger = (scope: string): Logger => {
	return new Logger({ scope });
};
