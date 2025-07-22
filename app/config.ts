import { ApiModeEnum } from "./enums/ApiModeEnum";
import { EnvEnum } from "./enums/EnvEnum";
import type { AppConfigInterface } from "./interfaces/AppConfigInterface";

/**
 * Global application configuration.
 *
 * This configuration defines the application's basic information,
 * including the name, active environment, API base URL, and API mode.
 */
const config: AppConfigInterface = {
	/**
	 * The current environment in which the application is running.
	 * This can be one of the following:
	 * - EnvEnum.DEV: Development environment
	 * - EnvEnum.TEST: Testing environment
	 * - EnvEnum.PROD: Production environment
	 */
	env: EnvEnum.PROD,
	/**
	 * The name of the application.
	 * This is used for display purposes and can be customized.
	 */
	name: "HRNet",
	/**
	 * The short name of the application.
	 * This is used for display purposes and can be customized.
	 */
	shortName: "hrnet",
	/**
	 * The base URL of the API.
	 * This is used to make requests to the server.
	 */
	apiBaseUrl: "http://localhost:3001/api/v1",
	/**
	 * The mode of the API.
	 * This can be one of the following:
	 * - ApiModeEnum.REAL: Real API mode
	 * - ApiModeEnum.MOCK: Mock API mode
	 */
	apiMode: ApiModeEnum.MOCK,
	/**
	 * Secret key used for encryption and HMAC operations.
	 * This is used by AppCrypto and AppCryptoSync classes.
	 */
	secret: "sKweHP6l6wkkCALohMATcIm94TMrBzJW",
	/**
	 * Salt value used to strengthen encryption.
	 * This is used in PBKDF2 key derivation process.
	 */
	salt: "OI39vtbAK7AQfG1s0yXNVj3uPye",
	/**
	 * Application description.
	 * Used for SEO and documentation purposes.
	 */
	description:
		"HRNet est une application de gestion des ressources humaines moderne qui permet de créer et consulter les employés de votre entreprise de manière efficace.",
	/**
	 * Duration for mock requests in milliseconds.
	 * Used to simulate API response delays in development/testing.
	 */
	mockDuration: 1500,
};


export default config;
