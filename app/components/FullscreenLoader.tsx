import Loader from "./Loader";

/**
 * FullscreenLoader component that displays a loading spinner overlay
 * covering the entire screen during application hydration or critical loading states.
 * 
 * Used primarily for:
 * - React hydration fallback
 * - Initial application loading
 * - Critical resource loading states
 * 
 * @returns {JSX.Element} A fullscreen loading overlay with centered spinner
 */
export function FullscreenLoader() {
  return (
	<div className="fullscreen-loader" data-testid="fullscreen-loader">
	  <div className="fullscreen-loader__overlay">
		<div className="fullscreen-loader__content">
		  <Loader size={60} className="fullscreen-loader__spinner" />
		  <div className="fullscreen-loader__text">
			<h2 className="fullscreen-loader__title">HRNet</h2>
			<p className="fullscreen-loader__subtitle">Loading...</p>
		  </div>
		</div>
	  </div>
	</div>
  );
}
