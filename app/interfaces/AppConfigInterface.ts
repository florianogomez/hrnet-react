import type { ApiModeEnum } from "~/enums/ApiModeEnum";
import type { EnvEnum } from "~/enums/EnvEnum";

/**
 * Contains environment parameters, display names, the API base URL,
 * and the data access mode.
 * This interface centralizes configuration and simplifies environment management.
 * @interface AppConfigInterface
 * @property {EnvEnum} env - The application's runtime environment (development or production).
 * @property {string} name - The name of the application.
 * @property {string} shortName - The short name of the application, used for compact displays.
 * @property {string} apiBaseUrl - The base URL of the API to use for network requests.
 * @property {ApiModeEnum} apiMode - The data access mode (mock or real).
 * @property {string} secret - Secret key used for encryption and HMAC operations.
 * @property {string} salt - Salt value used to strengthen encryption in cryptographic operations.
 * @property {string} description - Application description for SEO and documentation.
 * @property {number} mockDuration - Duration for mock requests in milliseconds.
 * @example
 * const appConfig: AppConfigInterface = {
 *   env: EnvEnum.DEV,
 *   name: "MyApp",
 *   shortName: "App",
 *   apiBaseUrl: "https://api.example.com",
 *   apiMode: ApiModeEnum.MOCK,
 *   secret: "yourSecretKey",
 *   salt: "yourSaltValue",
 *   description: "My awesome application",
 *   mockDuration: 1500
 * };
 */
export interface AppConfigInterface {
	env: EnvEnum;
	name: string;
	shortName: string;
	apiBaseUrl: string;
	apiMode: ApiModeEnum;
	secret: string;
	salt: string;
	description: string;
	mockDuration: number;
}
