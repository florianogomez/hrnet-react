import { createContext, useContext, useState } from 'react';
import type { ChildrenType } from '~/interfaces/LayoutInterface';

/**
 * Type for the children prop used in the LayoutProvider.
 * @typedef {object} ChildrenType
 * @property {React.ReactNode} children - The child components.
 */

/**
 * Interface for the layout context value.
 * @interface SimpleLayoutContextType
 * @property {boolean} isMenuOpen - Whether the mobile menu is open.
 * @property {() => void} toggleMenu - Function to toggle the menu state.
 */
interface SimpleLayoutContextType {
	/** Whether the mobile menu is open */
	isMenuOpen: boolean;
	/** Function to toggle the menu state */
	toggleMenu: () => void;
}

/**
 * React context for the HRNet layout state.
 * Provides menu open state and a toggle function.
 */
const LayoutContext = createContext<SimpleLayoutContextType | undefined>(undefined);

/**
 * Custom hook to access the layout context.
 * @returns {SimpleLayoutContextType} The layout context value.
 * @throws {Error} If used outside of a LayoutProvider.
 */
export const useLayoutContext = (): SimpleLayoutContextType => {
	const context = useContext(LayoutContext);
	if (!context) {
		throw new Error('useLayoutContext must be used within a LayoutProvider');
	}
	return context;
};

/**
 * Provider component for the layout context.
 * Manages only the mobile menu open state.
 *
 * @param {ChildrenType} props - The provider props containing children.
 * @returns {JSX.Element} The context provider with value.
 */
export const LayoutProvider = ({ children }: ChildrenType) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	/**
	 * Toggle the mobile menu open/close state.
	 */
	const toggleMenu = () => {
		setIsMenuOpen(prev => !prev);
	};

	const value: SimpleLayoutContextType = {
		isMenuOpen,
		toggleMenu,
	};

	return (
		<LayoutContext.Provider value={value}>
			{children}
		</LayoutContext.Provider>
	);
};
