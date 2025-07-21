import { employeeRoutes } from "./modules/employee/routes";

/**
 * Routes principales de l'application HRNet
 * 
 * @remarks
 * Centralise toutes les routes de l'application pour une gestion cohérente
 * et une navigation type-safe.
 */
export const appRoutes = {
	/** Page d'accueil / Dashboard */
	home: "/",
	
	/** Routes du module employés */
	employees: employeeRoutes,
	
	/** Page à propos */
	about: "/about",
	
	/** Page de contact */
	contact: "/contact",
	
	/** Page 404 - Non trouvé */
	notFound: "/404",
} as const;

export default appRoutes;
