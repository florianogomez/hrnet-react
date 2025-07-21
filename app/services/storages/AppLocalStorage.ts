
/**
 * Utility class for securely interacting with localStorage.
 * Provides type-safe methods for storing, retrieving, and removing encrypted data.
 * All values are encrypted before storage and decrypted upon retrieval.
 *
 * @class AppLocalStorage
 */
import { AppCrypto } from "~/appcrypto";
import { createLogger } from "~/utils/logger";

const logger = createLogger("AppLocalStorage");

export default class AppLocalStorage {
  /**
   * Prefix used for all keys stored to avoid collisions with other applications.
   */
  private static readonly PREFIX = "argent-bank-";

  /**
   * Flag indicating that a stored value is encrypted.
   */
  private static readonly ENCRYPTED_FLAG = "__ENCRYPTED__:";

  /**
   * Stores a value in localStorage with encryption.
   * @param key - The key under which the value will be stored
   * @param value - The value to store (will be JSON-stringified and encrypted)
   */
  static async set<T>(key: string, value: T): Promise<void> {
	try {
	  const serializedValue = JSON.stringify(value);
	  const encryptedValue = await AppCrypto.encrypt(serializedValue);
	  const flaggedValue = `${this.ENCRYPTED_FLAG}${encryptedValue}`;
	  window.localStorage.setItem(`${this.PREFIX}${key}`, flaggedValue);
	  logger.debug(`Encrypted value stored for key "${key}"`);
	} catch (error) {
	  logger.error(`Error storing secure key "${key}" in localStorage:`, error);
	}
  }

  /**
   * Retrieves and decrypts a value from localStorage.
   * @param key - The key to retrieve
   * @returns The decrypted stored value, or null if the key does not exist or on error
   */
  static async get<T>(key: string): Promise<T | null> {
	try {
	  const value = window.localStorage.getItem(`${this.PREFIX}${key}`);
	  if (value === null) return null;

	  // Check if the value is encrypted
	  if (value.startsWith(this.ENCRYPTED_FLAG)) {
		const encryptedValue = value.substring(this.ENCRYPTED_FLAG.length);
		const decryptedValue = await AppCrypto.decrypt(encryptedValue);
		const parsedValue = JSON.parse(decryptedValue) as T;
		logger.debug(`Decrypted value retrieved for key "${key}"`);
		return parsedValue;
	  } else {
		logger.warn(`Value for key "${key}" is not encrypted!`);
		return JSON.parse(value) as T;
	  }
	} catch (error) {
	  logger.error(`Error retrieving key "${key}" from localStorage:`, error);
	  return null;
	}
  }

  /**
   * Removes a value from localStorage.
   * @param key - The key to remove
   */
  static remove(key: string): void {
	try {
	  window.localStorage.removeItem(`${this.PREFIX}${key}`);
	  logger.debug(`Key "${key}" removed from localStorage`);
	} catch (error) {
	  logger.error(`Error removing key "${key}" from localStorage:`, error);
	}
  }

  /**
   * Checks if a key exists in localStorage.
   * @param key - The key to check
   * @returns true if the key exists, false otherwise
   */
  static has(key: string): boolean {
	return window.localStorage.getItem(`${this.PREFIX}${key}`) !== null;
  }

  /**
   * Clears all localStorage entries related to this application.
   * Only removes keys starting with the prefix.
   */
  static clear(): void {
	try {
	  Object.keys(window.localStorage)
		.filter((key) => key.startsWith(this.PREFIX))
		.forEach((key) => window.localStorage.removeItem(key));
	  logger.debug("LocalStorage cleared for the application");
	} catch (error) {
	  logger.error("Error clearing localStorage:", error);
	}
  }
}
