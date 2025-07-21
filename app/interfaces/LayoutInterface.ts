import type { ReactNode } from 'react';

/**
 * Interface for components that accept children as a prop.
 * @interface ChildrenType
 * @property {ReactNode} children - The child elements to render.
 */
export interface ChildrenType {
	children: ReactNode;
}

/**
 * Interface for common layout component props.
 * Extends ChildrenType to include children and allows an optional className.
 * @interface LayoutProps
 * @property {string} [className] - Optional CSS class name for the layout container.
 */
export interface LayoutProps extends ChildrenType {
	className?: string;
}

/**
 * Interface for a menu item in navigation components.
 * @interface MenuItem
 * @property {string} id - Unique identifier for the menu item.
 * @property {string} label - Display label for the menu item.
 * @property {string} path - Route path for the menu item.
 * @property {string} [icon] - Optional icon class for the menu item.
 * @property {boolean} [isActive] - Whether the menu item is currently active.
 */
export interface MenuItem {
	id: string;
	label: string;
	path: string;
	icon?: string;
	isActive?: boolean;
}

/**
 * Props for the horizontal navigation component.
 * @interface HorizontalNavigationProps
 * @property {MenuItem[]} menuItems - Array of menu items to display.
 * @property {(item: MenuItem) => void} [onItemClick] - Optional callback when a menu item is clicked.
 */
export interface HorizontalNavigationProps {
	menuItems: MenuItem[];
	onItemClick?: (item: MenuItem) => void;
}

/**
 * Props for the footer component.
 * @interface FooterProps
 * @property {string} [className] - Optional CSS class name for the footer.
 */
export interface FooterProps {
	className?: string;
}
