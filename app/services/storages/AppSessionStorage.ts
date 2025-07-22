/**
 * Utility class to securely interact with sessionStorage.
 * Provides type-safe methods for storing, retrieving, and removing encrypted data.
 * All values are encrypted before storage and decrypted upon retrieval.
 *
 * @class AppSessionStorage
 */
import { AppCrypto } from "~/appcrypto";
import { createLogger } from "~/utils/logger";

const logger = createLogger("AppSessionStorage");

export default class AppSessionStorage {
  /**
   * Prefix used for all keys stored to avoid collisions with other applications
   */
  private static readonly PREFIX = 'argent-bank-';
  
  /**
   * Key used to store the authentication token
   */
  static readonly AUTH_TOKEN_KEY = `${AppSessionStorage.PREFIX}auth-token`;
  
  /**
   * Key used to store user information
   */
  static readonly USER_DATA_KEY = `${AppSessionStorage.PREFIX}user-data`;
  
  /**
   * Flag indicating that a stored value is encrypted
   */
  private static readonly ENCRYPTED_FLAG = '__ENCRYPTED__:';
  
  /**
   * Stores a value in sessionStorage with encryption.
   * @param key - The key under which the value will be stored
   * @param value - The value to store (will be JSON-stringified and encrypted)
   */
  static async set<T>(key: string, value: T): Promise<void> {
    try {
      // Convert value to JSON
      const serializedValue = JSON.stringify(value);
      
      // Encrypt the value
      const encryptedValue = await AppCrypto.encrypt(serializedValue);
      
      // Add a flag indicating the value is encrypted
      const flaggedValue = `${this.ENCRYPTED_FLAG}${encryptedValue}`;
      
      // Store in sessionStorage
      window.sessionStorage.setItem(`${this.PREFIX}${key}`, flaggedValue);
      logger.debug(`Encrypted value stored for key "${key}"`);
    } catch (error) {
      logger.error(`Error storing encrypted key "${key}" in sessionStorage:`, error);
    }
  }
  
  /**
   * Retrieves and decrypts a value from sessionStorage.
   * @param key - The key to retrieve
   * @returns The decrypted stored value, or null if the key does not exist or on error
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = window.sessionStorage.getItem(`${this.PREFIX}${key}`);

      if (value === null) {
        return null;
      }
      
      // Check if the value is encrypted
      if (value.startsWith(this.ENCRYPTED_FLAG)) {
        // Extract the encrypted value (without the flag)
        const encryptedValue = value.substring(this.ENCRYPTED_FLAG.length);
        
        // Decrypt the value
        const decryptedValue = await AppCrypto.decrypt(encryptedValue);
        
        // Parse the JSON value
        const parsedValue = JSON.parse(decryptedValue) as T;
        logger.debug(`Decrypted value retrieved for key "${key}"`, parsedValue);
        return parsedValue;
      } else {
        // Unencrypted value (for compatibility with legacy data)
        logger.warn(`Value for key "${key}" is not encrypted!`);
        return JSON.parse(value) as T;
      }
    } catch (error) {
      logger.error(`Error retrieving key "${key}" from sessionStorage:`, error);
      return null;
    }
  }
  
  /**
   * Removes a value from sessionStorage.
   * @param key - The key to remove
   */
  static remove(key: string): void {
    try {
      window.sessionStorage.removeItem(`${this.PREFIX}${key}`);
      logger.debug(`Key "${key}" removed from sessionStorage`);
    } catch (error) {
      logger.error(`Error removing key "${key}" from sessionStorage:`, error);
    }
  }
  
  /**
   * Checks if a key exists in sessionStorage.
   * @param key - The key to check
   * @returns true if the key exists, false otherwise
   */
  static has(key: string): boolean {
    return window.sessionStorage.getItem(key) !== null;
  }
  
  /**
   * Clears all sessionStorage entries related to this application.
   * Only removes keys starting with the prefix.
   */
  static clear(): void {
    try {
      // Only remove keys related to our application
      Object.keys(window.sessionStorage)
        .filter(key => key.startsWith(AppSessionStorage.PREFIX))
        .forEach(key => window.sessionStorage.removeItem(key));
      logger.debug("SessionStorage cleared for the application");
    } catch (error) {
      logger.error("Error clearing sessionStorage:", error);
    }
  }
  
  /**
   * Stores the authentication token securely.
   * @param token - The JWT authentication token
   */
  static async setAuthToken(token: string): Promise<void> {
    await this.set(this.AUTH_TOKEN_KEY, token);
  }
  
  /**
   * Retrieves the authentication token securely.
   * @returns The decrypted authentication token or null
   */
  static async getAuthToken(): Promise<string | null> {
    return this.get<string>(this.AUTH_TOKEN_KEY);
  }
  
  /**
   * Checks if the user is authenticated.
   * @returns true if an authentication token is present, false otherwise
   */
  static isAuthenticated(): boolean {
    return this.has(this.AUTH_TOKEN_KEY);
  }
  
  /**
   * Stores user data securely.
   * @param userData - Object containing user data
   */
  static async setUserData<T>(userData: T): Promise<void> {
    await this.set(this.USER_DATA_KEY, userData);
  }
  
  /**
   * Retrieves user data securely.
   * @returns The decrypted user data or null
   */
  static async getUserData<T>(): Promise<T | null> {
    return this.get<T>(this.USER_DATA_KEY);
  }
  
  /**
   * Clears authentication data (logout).
   */
  static clearAuth(): void {
    this.remove(this.AUTH_TOKEN_KEY);
    this.remove(this.USER_DATA_KEY);
    logger.info("Authentication data cleared");
  }
}
