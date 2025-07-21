import { appLogger, Logger } from "./logger";

/**
 * Utility class for application-wide constants and methods.
 * @class AppUtils
 * This class provides a centralized location for application-wide constants and methods.
 * It includes a logger instance that can be used throughout the application.
 * The logger is automatically disabled in production environments.
 * @example
 * import { AppUtils } from '@/utils';
 * AppUtils.logger.info('This is an info message');
 */
export class AppUtils {
  /** Logger instance for the application */
  static logger: Logger = appLogger;
}