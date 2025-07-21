/**
 * Application route configuration using flat file-based routing.
 *
 * Uses @react-router/fs-routes to generate routes from the 'pages' directory.
 *
 * @see https://github.com/remix-run/react-router/tree/main/packages/fs-routes
 */
import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

/**
 * Exports the route configuration for the app.
 * @type {RouteConfig}
 */
export default flatRoutes({
  rootDirectory: 'pages',
}) satisfies RouteConfig;
