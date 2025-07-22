// Styles are now included in the main SCSS compilation
// import "../styles/components/loader.scss";

/**
 * Props interface for the Loader component.
 * 
 * @interface LoaderProps
 * @property {number} [size=20] - The size of the loader in pixels.
 * @property {string} [className=''] - Additional CSS class names to apply to the loader.
 */
export interface LoaderProps {
  size?: number;
  className?: string;
}

/**
 * Loader component that displays a visual loading indicator.
 * 
 * This component consists of:
 * - A spinning circle styled via SCSS
 * - Visual feedback that content is loading
 * 
 * Used throughout the application to indicate data fetching or processing operations.
 * The size can be customized through props.
 *
 * 
 * @example
 * // Default loader
 * <Loader />
 * 
 * @example
 * // Custom sized loader with additional class
 * <Loader size={40} className="centered-loader" />
 * 
 * @param {LoaderProps} props - Component props
 * @param {number} [props.size=20] - The size of the loader in pixels
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} A loading spinner element
 */
export default function Loader({ size = 20, className = '' }: LoaderProps) {
	return (
	   <div className={`loader ${className}`} data-testid="loader" style={{ width: size, height: size }}>
			<div className="loader__container" style={{ width: size, height: size }}>
				<div className="loader__circle" style={{ width: size, height: size }}></div>
			</div>
		</div>
	);
}
