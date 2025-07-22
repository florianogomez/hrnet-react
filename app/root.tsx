import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Provider } from "react-redux";
import { store } from "./store";
import { FullscreenLoader } from "./components/FullscreenLoader";
import AppProvidersWrapper from "./components/wrappers/AppProvidersWrapper";
import "./scss/app.scss";

/**
 * Defines the <link> tags to include in the HTML document's <head>.
 * Used to preconnect to Google Fonts and apply necessary styles.
 */
export const links: Route.LinksFunction = () => [
	// Préconnect pour les polices et CDN
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
	{ rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },


	// Google Fonts avec font-display:swap (chargement non-bloquant)
	{
		rel: "preload",
		as: "style",
		href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
	},
	{
		rel: "preload",
		as: "style",
		href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
	},

	// Bootstrap Icons chargement non-bloquant
	{
		rel: "preload",
		as: "style",
		href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css",
	},
	{
		rel: "stylesheet",
		href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
	},
];

/**
 * Layout component that defines the HTML document structure with comprehensive SEO meta tags.
 * This component wraps the entire application and provides the document shell.
 *
 * Features:
 * - Complete SEO meta tags (Open Graph, Twitter Cards, etc.)
 * - Favicons and app icons
 * - Font preloading
 * - Performance optimizations
 * - Accessibility features
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Complete HTML document structure
 */
export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr" data-theme="light">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				{/* Performance and Security */}
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="msapplication-TileColor" content="#2563eb" />
				<meta name="msapplication-config" content="/browserconfig.xml" />

				<Meta />
				<Links />
			</head>
			<body className="hrnet-app">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

/**
 * HydrateFallback component that displays during React hydration.
 * Shows a fullscreen loader while the application is initializing on the client side.
 *
 * @returns {JSX.Element} Fullscreen loading component
 */
export function HydrateFallback() {
	return <FullscreenLoader />;
}

/**
 * Main App component that provides the application structure with Redux store
 * and global providers. This is the root of the component tree.
 *
 * @returns {JSX.Element} Application root with providers and outlet
 */
export default function App() {
	return (
		<Provider store={store}>
			<AppProvidersWrapper>
				<Outlet />
			</AppProvidersWrapper>
		</Provider>
	);
}

/**
 * ErrorBoundary component that handles application-wide errors.
 * Provides user-friendly error messages and developer debugging information.
 *
 * Features:
 * - Different handling for route errors vs runtime errors
 * - Stack trace display in development mode
 * - User-friendly error messages
 * - Styled error UI with HRNet branding
 *
 * @param {Route.ErrorBoundaryProps} props - Error boundary props
 * @param {unknown} props.error - The error that was caught
 * @returns {JSX.Element} Error display component
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "Une erreur inattendue s'est produite.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "Page non trouvée" : "Erreur";
		details =
			error.status === 404
				? "La page demandée n'a pas pu être trouvée."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<div className="error-boundary">
			<div className="error-boundary__container">
				<div className="error-boundary__content">
					<div className="error-boundary__icon">
						<i className="bi bi-exclamation-triangle"></i>
					</div>
					<h1 className="error-boundary__title">{message}</h1>
					<p className="error-boundary__details">{details}</p>

					{stack && (
						<details className="error-boundary__stack">
							<summary className="error-boundary__stack-toggle">
								Détails techniques (développement)
							</summary>
							<pre className="error-boundary__stack-trace">
								<code>{stack}</code>
							</pre>
						</details>
					)}

					<div className="error-boundary__actions">
						<button className="btn btn-primary" onClick={() => window.location.reload()}>
							<i className="bi bi-arrow-clockwise me-2"></i>
							Recharger la page
						</button>
						<a href="/" className="btn btn-outline-secondary">
							<i className="bi bi-house me-2"></i>
							Retour à l'accueil
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
