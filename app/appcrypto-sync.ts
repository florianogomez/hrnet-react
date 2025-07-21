/**
 * Synchronous version of the encryption utility for Redux Persist integration.
 * This class uses synchronous methods compatible with Redux Persist transforms.
 * 
 * @class AppCryptoSync
 * Provides encryption and decryption methods that work synchronously for Redux Persist
 * 
 * @example
 * // Encrypting data for storage
 * const encryptedData = AppCryptoSync.encrypt(JSON.stringify(sensitiveData));
 * 
 * // Decrypting stored data
 * const decryptedData = AppCryptoSync.decrypt(encryptedValue);
 */
import { createLogger } from "~/utils/logger";
import CryptoJS from 'crypto-js';
import config from "~/config";

// Logger dedicated to this module
const logger = createLogger("AppCryptoSync");

export class AppCryptoSync {
  // Using the same secret key as the asynchronous implementation
  private static readonly SECRET_KEY = config.secret;
  
  /**
   * Encrypts a string synchronously
   * 
   * @param data - Data to encrypt
   * @returns The encrypted string
   * 
   * @example
   * const encryptedToken = AppCryptoSync.encrypt(authToken);
   */
  static encrypt(data: string): string {
    try {
      // Using synchronous CryptoJS methods
      // We also use salt to strengthen encryption
      const encrypted = CryptoJS.AES.encrypt(
        data, 
        this.SECRET_KEY, 
        { salt: CryptoJS.enc.Utf8.parse(config.salt) }
      ).toString();
      return encrypted;
    } catch (error) {
      logger.error("Error during synchronous encryption", error);
      // In case of error, return the original string
      // Note: In a production context, better error handling would be necessary
      return data;
    }
  }
  
  /**
   * Decrypts an encrypted string synchronously
   * 
   * @param encryptedData - Encrypted data
   * @returns The decrypted string
   * 
   * @example
   * const decryptedToken = AppCryptoSync.decrypt(encryptedAuthToken);
   * @throws Will not throw but returns empty string on error
   */
  static decrypt(encryptedData: string): string {
    try {
      // Using synchronous CryptoJS methods
      // We use the same parameters as for encryption
      const decrypted = CryptoJS.AES.decrypt(
        encryptedData, 
        this.SECRET_KEY, 
        { salt: CryptoJS.enc.Utf8.parse(config.salt) }
      ).toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      logger.error("Error during synchronous decryption", error);
      // In case of error, return an empty string to avoid crashing the application
      // Note: In a production context, better error handling would be necessary
      return "";
    }
  }
}
