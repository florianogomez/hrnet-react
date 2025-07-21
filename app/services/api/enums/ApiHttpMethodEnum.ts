/**
 * Enumeration of standardized HTTP methods for API requests.
 * Ensures consistent method usage across the application.
 * @enum ApiHttpMethodEnum
 * @example
 * import { ApiHttpMethodEnum } from './ApiHttpMethodEnum'
 * const method = ApiHttpMethodEnum.GET
 */
export enum ApiHttpMethodEnum {
  /**
   * HTTP GET method used to retrieve resources from the server.
   * Used for read-only requests without side effects.
   */
  GET = "GET",

  /**
   * HTTP POST method used to send data to the server and create a resource.
   * Typically used for creating entities on the server side.
   */
  POST = "POST",

  /**
   * HTTP PUT method used to update an existing resource or create it if it does not exist.
   * Used to fully replace a resource at a given URI or create it if absent.
   */
  PUT = "PUT",

  /**
   * HTTP DELETE method used to remove a resource on the server.
   * Allows the deletion of an entity identified by a specific URI.
   */
  DELETE = "DELETE",
}

export default ApiHttpMethodEnum;
