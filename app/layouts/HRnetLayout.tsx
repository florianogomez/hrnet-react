import { LayoutProvider } from "~/context/LayoutContext";
import HorizontalLayout from "~/layouts/HorizontalLayout";
import type { ChildrenType } from "~/interfaces/LayoutInterface";

/**
 * Root layout component for the HRNet application.
 * Provides all necessary providers and integrates the enterprise layout system.
 *
 * @param {ChildrenType} props - The layout props containing children.
 * @param {React.ReactNode} props.children - The main content to render inside the layout.
 * @returns {JSX.Element} The complete root layout with providers and horizontal layout.
 */
export default function HRnetLayout({ children }: ChildrenType) {
	return (
		<LayoutProvider>
			<HorizontalLayout>{children}</HorizontalLayout>
		</LayoutProvider>
	);
}
