import { Link, useLocation } from 'react-router';

/**
 * Interface for a simple menu item in the horizontal navigation.
 * @interface SimpleMenuItem
 * @property {string} id - Unique identifier for the menu item.
 * @property {string} label - Display label for the menu item.
 * @property {string} path - Route path for the menu item.
 * @property {string} [icon] - Optional icon class for the menu item.
 */
interface SimpleMenuItem {
	id: string;
	label: string;
	path: string;
	icon?: string;
}

/**
 * Props for the HorizontalNavigation component.
 * @interface SimpleHorizontalNavigationProps
 * @property {SimpleMenuItem[]} menuItems - Array of menu items to display.
 */
interface SimpleHorizontalNavigationProps {
	menuItems: SimpleMenuItem[];
}


/**
 * Ultra-simplified horizontal navigation component for HRNet.
 * Renders a navigation bar with menu items and optional icons.
 *
 * @param {SimpleHorizontalNavigationProps} props - The component props.
 * @returns {JSX.Element} The rendered navigation bar.
 */
const HorizontalNavigation = ({ menuItems }: SimpleHorizontalNavigationProps) => {
	const location = useLocation();

	return (
		<nav className="navbar navbar-expand-lg bg-white shadow-sm border-bottom">
			<div className="container-fluid px-4">
				{/* HRNet Logo */}
				<Link to="/" className="navbar-brand fw-bold text-primary">
					<i className="bi bi-building me-2"></i>
					HRNet
				</Link>

				{/* Navigation menu */}
				<div className="navbar-nav flex-row gap-3 ms-auto">
					{menuItems.map((item) => (
						<Link
							key={item.id}
							to={item.path}
							className={`nav-link px-3 py-2 rounded-pill text-decoration-none ${
								location.pathname === item.path 
									? 'bg-primary text-white' 
									: 'text-dark hover-bg-light'
							}`}
						>
							{item.icon && <i className={`${item.icon} me-1`}></i>}
							{item.label}
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
};

export default HorizontalNavigation;
export { HorizontalNavigation };