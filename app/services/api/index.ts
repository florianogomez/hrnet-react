/**
 * Entry point for the API services module.
 * 
 * @remarks
 * This file centralizes all API-related exports including:
 * - API Consumer base class
 * - HTTP method enumerations
 * - API error classes
 * - API client instances
 * - Specific API consumers
 * - API interfaces and models
 * 
 * @packageDocumentation
 */

// Core API functionality
export { ApiConsumer } from "./ApiConsumer";
export { default as ApiHttpMethodEnum } from "./enums/ApiHttpMethodEnum";

// API Clients
export * from "./clients";

// API Consumers
export * from "./consumers";

// API Errors
export * from "./errors";

// API Interfaces
export type { ApiResponseInterface } from "./interfaces/ApiResponseInterface";
export type { ApiResourceInterface } from "./interfaces/ApiResourceInterface";
export type { ApiErrorDataInterface } from "./interfaces/ApiErrorDataInterface";

// API Models
export { ApiResourceModel } from "./models/ApiResourceModel";
