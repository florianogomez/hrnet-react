
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { isAxiosError } from 'axios';

import {
  ApiError,
  InternalServerApiError,
  UnauthorizedApiError,
  ConflictApiError,
  GeneralApiError,
  NotFoundApiError,
} from "./errors";

import { createLogger } from '~/utils/logger';
import ApiHttpMethodEnum from './enums/ApiHttpMethodEnum';
import type { ApiResponseInterface } from './interfaces/ApiResponseInterface';
import BadRequestApiError from './errors/BadRequestApiError';

const logger = createLogger("ApiConsumer");

/**
 * @module ApiConsumer
 * @description
 * Provides a base class for performing HTTP API calls using Axios. Handles request configuration, error processing, and response wrapping for consistent API consumption.
 */

/**
 * Interface for ApiConsumer constructor arguments.
 * @property {AxiosInstance} client - Axios instance for HTTP requests.
 * @property {string} path - API endpoint path.
 * @property {ApiHttpMethodEnum} method - HTTP method to use (GET, POST, etc.).
 * @property {Record<string, any>} [data] - Data to send with the request.
 */
export interface ApiConsumerArgumentsInterface {
	client: AxiosInstance;
	path: string;
	method: ApiHttpMethodEnum;
	data?: Record<string, any>;
}

/**
 * Base class for performing HTTP calls via Axios.
 * This class includes request configuration building,
 * HTTP method handling, error processing, and response wrapping.
 *
 * @property {AxiosInstance} client - Axios instance for HTTP requests.
 * @property {string} path - API endpoint path.
 * @property {ApiHttpMethodEnum} method - HTTP method to use (GET, POST, etc.).
 * @property {Record<string, any>} [data] - Data to send with the request.
 */
export class ApiConsumer {
	client: AxiosInstance;
	path: string;
	method: ApiHttpMethodEnum;
	data?: Record<string, any>;

	/**
	 * Constructor for ApiConsumer.
	 * @param {ApiConsumerArgumentsInterface} options - Options to create the ApiConsumer instance.
	 * @param {AxiosInstance} options.client - Axios instance for HTTP requests.
	 * @param {string} options.path - API endpoint path.
	 * @param {ApiHttpMethodEnum} options.method - HTTP method to use (GET, POST, etc.).
	 * @param {Record<string, any>} [options.data] - Data to send with the request.
	 * @example
	 * const apiConsumer = new ApiConsumer({
	 *   client: axiosInstance,
	 *   path: "/user/12",
	 *   method: ApiHttpMethodEnum.GET
	 * });
	 */
	constructor({ client, path, method, data = {} }: ApiConsumerArgumentsInterface) {
		this.client = client;
		this.path = path;
		this.method = method;
		this.data = data;
	}

	/**
	 * Returns the data configuration according to the HTTP method used.
	 * @returns An object containing either `params` for GET or `data` for other methods.
	 */
	get requestDataConfig(): Record<string, any> {
		if (this.method === ApiHttpMethodEnum.GET) return { params: this.data };
		else return { data: this.data };
	}

	/**
	 * Returns the content type headers for the HTTP request.
	 * @returns An object containing the `Content-Type` header.
	 */
	get requestContentTypeConfig(): Record<string, string> {
		return { "Content-Type": "application/json" };
	}

	/**
	 * Builds the complete Axios request configuration.
	 * @returns The Axios request configuration.
	 */
	getRequestConfig(): AxiosRequestConfig {
		return {
			url: this.path,
			method: this.method,
			...this.requestDataConfig,
			headers: {
				...this.requestContentTypeConfig,
			},
		};
	}

	/**
	 * Sends the request to the API and returns the response data or a typed error.
	 * @returns The API data or a custom {@link ApiError} instance.
	 */
	async request(): Promise<any | ApiError> {
		try {
			const response = await this.client.request(this.getRequestConfig());

			logger.info(`API REQUEST ${this.method}  ${this.path} :`, this.data, response.data);

			if (!response.data.message) {
				logger.error(`[500] API ERROR ${this.method}  ${this.path} : :`, {
					payload: this.data,
					response: { data: null },
				});

				return new InternalServerApiError({
			   message: "Internal server error",
					status: 500,
				});
			}

			return response.data as ApiResponseInterface;
		} catch (error) {
			if (isAxiosError(error)) {
				logger.error(
					`[${error.response?.status}] API ERROR ${this.method}  ${this.path} :`,
					this.data,
					error
				);

				return this.handleAxiosError(error);
			}

			throw error;
		}
	}

	/**
	 * Intercepts and handles errors from Axios by translating them
	 * into custom application-specific errors.
	 * @param error - The intercepted Axios error.
	 * @returns An instance of a class derived from {@link ApiError}.
	 */
	handleAxiosError(error: AxiosError<any>): ApiError {
		const response = error.response?.data as ApiResponseInterface | undefined;

		logger.error(`API ERROR ${this.method}  ${this.path} :`, {
			payload: this.data,
			response: response || { data: null },
			error,
		})

		if (response && error.status === 400) {
			return new BadRequestApiError(response);
		}

		if (response && error.status === 401) {
			return new UnauthorizedApiError(response);
		}

		if (response && error.status === 500) {
			return new InternalServerApiError(response);
		}

		if (response && error.status === 404) {
			return new NotFoundApiError(this.path, response);
		}

		if (response && error.status === 409) {
			return new ConflictApiError(response);
		}

		return new GeneralApiError(error, {
			message: response?.message || "",
			data: error.response?.data,
		});
	}
}
