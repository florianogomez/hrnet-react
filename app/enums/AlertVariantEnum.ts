/**
 * Enumeration of possible visual alert variants in the application.
 * Used to determine the style or display type of alert messages.
 */
enum AlertVariantEnum {
  /**
   * Default variant, typically used for neutral alerts.
   */
  PRIMARY = 'primary',
  /**
   * Secondary variant, often used for less important alerts.
   */
  SECONDARY = 'secondary',
  /**
   * Info variant, used for informational messages.
   */
  INFO = 'info',
  /**
   * Success variant, used for success messages.
   */
  SUCCESS = 'success',
  /**
   * Warning variant, used for warning messages.
   */
  WARNING = 'warning',
  /**
   * Error variant, used for error messages.
   */
  ERROR = 'error',
}

export { AlertVariantEnum };
