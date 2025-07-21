/**
 * Defines the structure of navigation items in the application.
 * Used for creating navigation links in headers, sidebars, and menus.
 * @interface AppNavigationInterface
 * @property {string} name - The display text for the navigation item.
 * @property {string} href - The URL or path that the navigation item should link to.
 * @property {string} [icon] - Optional CSS class for an icon to display with the navigation item.
 * @property {(e: React.MouseEvent) => void} [onClick] - Optional click handler for the navigation item.
 * @example
 * const navItem: AppNavigationInterface = {
 *   name: "Sign In",
 *   href: "/signin",
 *   icon: "fa fa-user-circle"
 * };
 */
export interface AppNavigationInterface {
	name: string;
	href: string;
	icon?: string;
	onClick?: (e: React.MouseEvent) => void;
}