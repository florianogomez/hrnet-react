
/**
 * Options for storage operations, including persistence and Redux synchronization.
 * @template T
 * @property {boolean} [persistent] - If true, value is stored in IndexedDB; otherwise, in sessionStorage.
 * @property {ReduxSyncInterface<T>} [redux] - Optional Redux synchronization for dispatching actions or selecting state.
 */
export interface AppStorageOptions<T> {
  /**
   * If true, the value will be stored in localStorage. Otherwise, sessionStorage is used.
   */
  persistent?: boolean;

  /**
   * Optional Redux synchronization for dispatching actions or selecting state.
   */
  redux?: import("~/interfaces/ReduxSyncInterface").ReduxSyncInterface<T>;
}

/**
 * Abstract base class for application storage services.
 * Provides unified methods for storing, retrieving, and removing data using IndexedDB, sessionStorage, and Redux.
 *
 * @class AppStorageService
 */
import AppIndexedDBStorage from "./AppIndexedDBStorage";
import AppSessionStorage from "./AppSessionStorage";
import { store } from "~/store";
import { createLogger } from "~/utils/logger";

const logger = createLogger("AppStorageService");

export abstract class AppStorageService {
  protected prefix: string;

  /**
   * Initializes the storage service with a prefix name.
   * @param name - Prefix for all storage keys
   */
  constructor({ name }: { name: string }) {
	this.prefix = name;
	logger.info(`Storage service initialized for "${this.prefix}"`);
  }

  /**
   * Returns the base storage key for the current module.
   */
  get storageKey(): string {
	return `${this.prefix}-storage`;
  }

  /**
   * Computes a full storage key for a given identifier.
   * @param key - The identifier to append
   * @returns The computed storage key
   */
  computeStorageKey(key: string): string {
	return `${this.storageKey}-${key}`;
  }

  /**
   * Stores a value in Redux (if configured) and in the chosen storage (IndexedDB or sessionStorage).
   * @param key - Identifier key for the value
   * @param value - The value to store
   * @param options - Options for persistence and optional Redux synchronization
   */
  async set<T>(key: string, value: T, options: AppStorageOptions<T> = {}): Promise<void> {
	try {
	  if (options.redux?.action) {
		store.dispatch(options.redux?.action(value));
		logger.debug(`Data dispatched to Redux for key "${key}"`);
	  }

	  const { persistent = true } = options;
	  const storageKey = this.computeStorageKey(key);
	  if (persistent) {
		await AppIndexedDBStorage.set(storageKey, value);
		logger.debug(`Value persisted in IndexedDB for "${key}"`);
	  } else {
		await AppSessionStorage.set(storageKey, value);
		logger.debug(`Value persisted in sessionStorage for "${key}"`);
	  }
	} catch (error) {
	  logger.error(`Error storing "${key}"`, error);
	}
  }

  /**
   * Retrieves a value by checking sessionStorage first, then IndexedDB, and finally Redux state.
   * If the value is found in storage, Redux state can be updated accordingly.
   * @param key - Identifier key for the value
   * @param options - Optional Redux selector and sync behavior
   * @returns The value found or null if not available
   */
  async get<T>(key: string, options: AppStorageOptions<T> = {}): Promise<T | null> {
	const storageKey = this.computeStorageKey(key);

	try {
	  // 1. Check sessionStorage first
	  const sessionValue = await AppSessionStorage.get<T>(storageKey);
	  if (sessionValue !== null) {
		logger.debug(`Value retrieved from sessionStorage for "${key}"`);
		// hydrate Redux if needed
		if (options.redux?.action) {
		  store.dispatch(options.redux.action(sessionValue));
		}
		return sessionValue;
	  }

	  // 2. Then check IndexedDB
	  const indexedValue = await AppIndexedDBStorage.get<T>(storageKey);
	  if (indexedValue !== null) {
		logger.debug(`Value retrieved from IndexedDB for "${key}"`);
		if (options.redux?.action) {
		  store.dispatch(options.redux.action(indexedValue));
		}
		// Synchronize with sessionStorage for future accesses
		await AppSessionStorage.set(storageKey, indexedValue);
		return indexedValue;
	  }

	  // 3. Finally, check Redux if persistent or already hydrated
	  if (options.redux?.selector) {
		const stateValue = options.redux.selector(store.getState());
		if (stateValue != null) {
		  logger.debug(`Value found in Redux for "${key}"`);
		  return stateValue as T;
		}
	  }

	  return null;
	} catch (error) {
	  logger.error(`Error retrieving "${key}"`, error);
	  return null;
	}
  }

  /**
   * Removes a value from both sessionStorage and IndexedDB.
   * @param key - Identifier key of the value to remove
   */
  async remove(key: string) {
	const storageKey = this.computeStorageKey(key);
	try {
	  AppSessionStorage.remove(storageKey);
	  await AppIndexedDBStorage.remove(storageKey);
	  logger.debug(`Key removed: "${key}"`);
	} catch (error) {
	  logger.error(`Error removing "${key}"`, error);
	}
  }

  /**
   * Clears all values related to the current module (using the defined prefix) from both storages.
   */
  clear(): void {
	try {
	  const prefix = this.storageKey;
	  Object.keys(window.sessionStorage)
		.filter((key) => key.startsWith(prefix))
		.forEach((key) => window.sessionStorage.removeItem(key));

	  Object.keys(window.localStorage)
		.filter((key) => key.startsWith(prefix))
		.forEach((key) => window.localStorage.removeItem(key));

	  logger.info(`All items related to "${this.prefix}" have been removed`);
	} catch (error) {
	  logger.error(`Error clearing data for "${this.prefix}"`, error);
	}
  }

  /**
   * Clears all application-related storage data from sessionStorage and IndexedDB.
   */
  static async clearAll(): Promise<void> {
	AppSessionStorage.clear();
	await AppIndexedDBStorage.clear();
	logger.info("All application storages have been cleared");
  }
}
