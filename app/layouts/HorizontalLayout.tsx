import { Suspense } from "react";
import { FullscreenLoader } from "~/components/FullscreenLoader";
import { HorizontalNavigation } from "~/components/layout/HorizontalNavigation";
import type { ChildrenType } from "~/interfaces/LayoutInterface";

/**
 * Ultra-simplified horizontal layout component for HRNet.
 * Provides a horizontal navigation bar and a main content area with suspense fallback.
 *
 * @param {ChildrenType} props - The layout props containing children.
 * @param {React.ReactNode} props.children - The main content to render inside the layout.
 * @returns {JSX.Element} The horizontal layout with navigation and content.
 */
const HorizontalLayout = ({ children }: ChildrenType) => {
	/**
	 * Menu items for the horizontal navigation bar.
	 */
const menuItems = [
  { id: "home", label: "Home", path: "/", icon: "bi bi-house" },
  { id: "employees", label: "Employees", path: "/employees", icon: "bi bi-people" },
  { id: "add-employee", label: "Add", path: "/employees/add", icon: "bi bi-person-plus" },
];

	return (
		<div className="wrapper horizontal-layout min-vh-100 d-flex flex-column">
   {/* Horizontal navigation */}
			<HorizontalNavigation menuItems={menuItems} />

   {/* Main content */}
			<main className="flex-grow-1 bg-light">
				<div className="container-fluid py-4">
					<Suspense fallback={<FullscreenLoader />}>{children}</Suspense>
				</div>
			</main>
		</div>
	);
};

export default HorizontalLayout;
