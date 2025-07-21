/**
 * Utility class for interacting with IndexedDB for persistent client-side storage.
 * Provides async methods for storing, retrieving, and removing data in a dedicated object store.
 *
 * @class AppIndexedDBStorage
 */
import { createLogger } from "~/utils/logger";

const logger = createLogger("AppIndexedDBStorage");

const DB_NAME = "hrnet_db";
const DB_VERSION = 1;
const STORE_NAME = "hrnet_store";

export default class AppIndexedDBStorage {
	private static dbPromise: Promise<IDBDatabase> | null = null;

	private static isClient(): boolean {
		return typeof window !== 'undefined' && 'indexedDB' in window;
	}

	private static getDbPromise(): Promise<IDBDatabase> {
		if (!AppIndexedDBStorage.dbPromise) {
			AppIndexedDBStorage.dbPromise = AppIndexedDBStorage.openDB();
		}
		return AppIndexedDBStorage.dbPromise;
	}

	private static openDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			if (!AppIndexedDBStorage.isClient()) {
				reject(new Error('IndexedDB n\'est pas disponible côté serveur'));
				return;
			}

			const request = window.indexedDB.open(DB_NAME, DB_VERSION);

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME);
				}
			};

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	private static async getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
		if (!AppIndexedDBStorage.isClient()) {
			throw new Error('IndexedDB n\'est pas disponible côté serveur');
		}
		
		const db = await AppIndexedDBStorage.getDbPromise();
		const tx = db.transaction(STORE_NAME, mode);
		return tx.objectStore(STORE_NAME);
	}

	static async set<T>(key: string, value: T): Promise<void> {
		if (!AppIndexedDBStorage.isClient()) {
			logger.warn(`Tentative de stockage côté serveur pour la clé "${key}"`);
			return;
		}

		try {
			const serialized = JSON.stringify(value);
			const store = await this.getStore("readwrite");
			
			await new Promise<void>((res, rej) => {
				const req = store.put(serialized, key);
				req.onsuccess = () => res();
				req.onerror = () => rej(req.error);
			});

			logger.debug(`Value stored for key "${key}" in IndexedDB`);
		} catch (error) {
			logger.error(`Error storing key "${key}" in IndexedDB:`, error);
		}
	}

	static async get<T>(key: string): Promise<T | null> {
		if (!AppIndexedDBStorage.isClient()) {
			logger.warn(`Tentative de lecture côté serveur pour la clé "${key}"`);
			return null;
		}

		try {
			const store = await this.getStore("readonly");
			const raw: string | undefined = await new Promise((res, rej) => {
				const req = store.get(key);
				req.onsuccess = () => res(req.result);
				req.onerror = () => rej(req.error);
			});

			if (raw == null) {
				return null;
			}

			const parsed = JSON.parse(raw) as T;
			logger.debug(`Value retrieved for key "${key}" from IndexedDB`);
			return parsed;
		} catch (error) {
			logger.error(`Error retrieving key "${key}" from IndexedDB:`, error);
			return null;
		}
	}

	static async remove(key: string): Promise<void> {
		if (!AppIndexedDBStorage.isClient()) {
			logger.warn(`Tentative de suppression côté serveur pour la clé "${key}"`);
			return;
		}

		try {
			const store = await this.getStore("readwrite");
			await new Promise<void>((res, rej) => {
				const req = store.delete(key);
				req.onsuccess = () => res();
				req.onerror = () => rej(req.error);
			});
			logger.debug(`Key "${key}" removed from IndexedDB`);
		} catch (error) {
			logger.error(`Error removing key "${key}" from IndexedDB:`, error);
		}
	}

	static async has(key: string): Promise<boolean> {
		if (!AppIndexedDBStorage.isClient()) {
			logger.warn(`Tentative de vérification côté serveur pour la clé "${key}"`);
			return false;
		}

		try {
			const store = await this.getStore("readonly");
			const exists = await new Promise<boolean>((res, rej) => {
				const req = store.getKey(key);
				req.onsuccess = () => res(req.result !== undefined);
				req.onerror = () => rej(req.error);
			});
			return exists;
		} catch (error) {
			logger.error(`Error checking existence of key "${key}" in IndexedDB:`, error);
			return false;
		}
	}

	static async clear(): Promise<void> {
		if (!AppIndexedDBStorage.isClient()) {
			logger.warn(`Tentative de nettoyage côté serveur`);
			return;
		}

		try {
			const store = await this.getStore("readwrite");
			await new Promise<void>((res, rej) => {
				const req = store.clear();
				req.onsuccess = () => res();
				req.onerror = () => rej(req.error);
			});
			logger.debug("All keys cleared from IndexedDB store");
		} catch (error) {
			logger.error("Error clearing IndexedDB store:", error);
		}
	}
}
