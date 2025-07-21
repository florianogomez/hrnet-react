import { Outlet } from "react-router";
import HRnetLayout from "~/layouts/HRnetLayout";

/**
 * Root layout component for routes using the main application layout.
 * This component provides the global structure for most pages in the application,
 * including the navigation bar, main content area, and footer.
 *
 * @returns {JSX.Element} The main layout wrapper with outlet for child routes
 */
export default function RootLayout() {
	return (
		<HRnetLayout>
			<Outlet />
		</HRnetLayout>
	);
}
