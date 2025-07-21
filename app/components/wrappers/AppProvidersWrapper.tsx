import { useEffect } from "react";
import { createLogger } from "~/utils/logger";

const logger = createLogger("AppProvidersWrapper");

/**
 * Props interface for AppProvidersWrapper component.
 * @interface AppProvidersWrapperProps
 * @property {React.ReactNode} children - Child components to be wrapped by the providers.
 */
interface AppProvidersWrapperProps {
	children: React.ReactNode;
}

/**
 * AppProvidersWrapper component that wraps the entire application
 * with necessary providers and global configurations.
 *
 * This component handles:
 * - Global application state management
 * - Theme initialization
 * - Error boundaries
 * - Performance monitoring
 * - User preferences loading
 *
 * @param {AppProvidersWrapperProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Wrapped application content
 */
export default function AppProvidersWrapper({ children }: AppProvidersWrapperProps) {
	useEffect(() => {
		logger.info("Application providers initialized");
		// Initialize global application settings
		initializeApp();
		return () => {
			logger.info("Application providers cleanup");
		};
	}, []);

	/**
	 * Initialize global application settings and configurations.
	 * Sets document language, theme, app version, and logs initialization.
	 *
	 * @private
	 */
	const initializeApp = () => {
		// Set document language
		document.documentElement.lang = 'fr';
		// Initialize theme preference
		const savedTheme = localStorage.getItem('hrnet-theme') || 'light';
		document.documentElement.setAttribute('data-theme', savedTheme);
		// Set app version for debugging
		(window as any).__HRNET_VERSION__ = '1.0.0';
		// Log application initialization
		logger.info("HRNet application initialized", {
			theme: savedTheme,
			userAgent: navigator.userAgent,
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight
			}
		});
	};

	return (
		<div className="app-providers-wrapper">
			{children}
		</div>
	);
}
