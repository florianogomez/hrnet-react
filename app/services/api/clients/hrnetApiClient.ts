import appConfig from '~/config'
import axios from 'axios'

/**
 * Axios instance configured to communicate with the HRNet API.
 *
 * @remarks
 * This instance centralizes the configuration for outbound HTTP requests to the HRNet API.
 * It sets the base URL from the global configuration (`appConfig.apiBaseUrl`)
 * and enforces a timeout of 30 seconds for all requests.
 *
 * This setup avoids repetitive configuration across different consumer modules,
 * simplifying maintenance and improving consistency for network requests.
 *
 * @example
 * ```ts
 * // Example: GET request to the /employees endpoint
 * hrnetApiClient.get('/employees').then(response => {
 *   console.log(response.data);
 * });
 * ```
 */

const hrnetApiClient = axios.create({
	baseURL: appConfig.apiBaseUrl || "http://localhost:3001/api",
	timeout: 30000,
});

hrnetApiClient.interceptors.request.use(async (config) => {
	config.headers = config.headers || {};

	// Add default headers for HRNet API
	config.headers['Content-Type'] = 'application/json';
	config.headers['Accept'] = 'application/json';

	return config;
});

hrnetApiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Log all API errors for debugging
		console.error('HRNet API Error:', {
			url: error.config?.url,
			method: error.config?.method,
			status: error.response?.status,
			message: error.response?.data?.message || error.message,
		});
		return Promise.reject(error);
	}
);

export { hrnetApiClient };
