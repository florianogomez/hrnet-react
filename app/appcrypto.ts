/**
 * Asynchronous cryptography utility class for secure data encryption and decryption.
 * 
 * @class AppCrypto
 * Provides methods for encrypting and decrypting sensitive information using Web Crypto API
 * 
 * @remarks
 * Uses AES-GCM encryption algorithm with PBKDF2 key derivation for secure cryptographic operations.
 * All methods are asynchronous and return Promises.
 * 
 * @example
 * // Encrypting sensitive data
 * const encrypted = await AppCrypto.encrypt("sensitive data");
 * 
 * // Decrypting data
 * const decrypted = await AppCrypto.decrypt(encrypted);
 */
import config from "~/config";

export class AppCrypto {
	private static secret = config.secret;
	private static salt = config.salt;

	/**
	 * Encrypts a text string using AES-GCM algorithm
	 * 
	 * @param text - Plain text to encrypt
	 * @returns Promise resolving to the encrypted string in Base64 format
	 * 
	 * @example
	 * const encryptedToken = await AppCrypto.encrypt("user-auth-token");
	 */
	public static async encrypt(text: string): Promise<string> {
		const encoder = new TextEncoder();
		const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate random IV (12 bytes)
		const key = await this.deriveKey(this.secret);

		const encrypted = await crypto.subtle.encrypt(
			{ name: "AES-GCM", iv },
			key,
			encoder.encode(text)
		);

		// Combinaison IV + données chiffrées, puis conversion en Base64
		const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);

		combined.set(iv, 0);
		combined.set(new Uint8Array(encrypted), iv.byteLength);

		return this.arrayBufferToBase64(combined.buffer);
	}

	/**
	 * Decrypts an encrypted string created with the encrypt method
	 * 
	 * @param encryptedText - Base64 encoded encrypted string
	 * @returns Promise resolving to the decrypted plain text
	 * 
	 * @example
	 * const plainText = await AppCrypto.decrypt(encryptedData);
	 */
	public static async decrypt(encryptedText: string): Promise<string> {
		const decoder = new TextDecoder();
		const encryptedData = this.base64ToArrayBuffer(encryptedText);

		// Extract IV and encrypted data
		const iv = encryptedData.slice(0, 12); // First 12 bytes correspond to the IV
		const data = encryptedData.slice(12);

		const key = await this.deriveKey(this.secret);

		const decrypted = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv: new Uint8Array(iv) },
			key,
			data
		);

		return decoder.decode(decrypted);
	}

	/**
	 * Derives a cryptographic key from the secret using PBKDF2
	 * 
	 * @param secret - Secret key string
	 * @returns Promise resolving to a CryptoKey for encryption/decryption
	 * @private
	 */
	private static async deriveKey(secret: string): Promise<CryptoKey> {
		const encoder = new TextEncoder();

		const keyMaterial = await crypto.subtle.importKey(
			"raw",
			encoder.encode(secret),
			{ name: "PBKDF2" },
			false,
			["deriveKey"]
		);

		return crypto.subtle.deriveKey(
			{
				name: "PBKDF2",
				salt: encoder.encode(AppCrypto.salt),
				iterations: 100000,
				hash: "SHA-256",
			},
			keyMaterial,
			{ name: "AES-GCM", length: 256 },
			false,
			["encrypt", "decrypt"]
		);
	}

	/**
	 * Converts an ArrayBuffer to a Base64 string
	 * 
	 * @param buffer - ArrayBuffer to convert
	 * @returns Base64 encoded string
	 * @private
	 */
	private static arrayBufferToBase64(buffer: ArrayBuffer): string {
		const byteArray = new Uint8Array(buffer);
		const charCodes = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), "");

		return btoa(charCodes);
	}

	/**
	 * Converts a Base64 string to an ArrayBuffer
	 * 
	 * @param base64 - Base64 encoded string
	 * @returns ArrayBuffer containing the decoded data
	 * @private
	 */
	private static base64ToArrayBuffer(base64: string): ArrayBuffer {
		const binaryString = atob(base64);
		const byteArray = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) byteArray[i] = binaryString.charCodeAt(i);

		return byteArray.buffer;
	}

	/**
	 * Creates an HMAC key from the application secret
	 * 
	 * @returns Promise resolving to a CryptoKey for HMAC operations
	 * @private
	 */
	private static async getHmacKey(): Promise<CryptoKey> {
		// Import the secret key as a CryptoKey
		const encoder = new TextEncoder();
		const keyData = encoder.encode(config.secret);

		return crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-512" }, false, [
			"sign",
		]);
	}

	/**
	 * Computes an HMAC signature for the provided data
	 * 
	 * @param data - String data to sign
	 * @returns Promise resolving to the Base64 encoded HMAC signature
	 * @private
	 */
	private static async computeHmac(data: string): Promise<string> {
		const encoder = new TextEncoder();
		const key = await AppCrypto.getHmacKey();
		const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));

		return AppCrypto.arrayBufferToBase64(signature);
	}

	/**
	 * Public method to generate an HMAC signature for the given key
	 * 
	 * @param key - String key to generate HMAC for
	 * @returns Promise resolving to the Base64 encoded HMAC signature
	 * 
	 * @example
	 * // Generate a signature for authentication
	 * const signature = await AppCrypto.getHmac(userId + timestamp);
	 */
	public static async getHmac(key: string): Promise<string> {
		return AppCrypto.computeHmac(key);
	}
}
