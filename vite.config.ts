
/**
 * Vite configuration file for the HRnet React application.
 *
 * @file vite.config.ts
 * @module vite-config
 *
 * @remarks
 * This configuration enables React Router, TailwindCSS, TypeScript path aliases, and automatic import of React and app modules.
 *
 * @see {@link https://vitejs.dev/}
 */
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";

/**
 * Exports the Vite configuration for the HRnet React application.
 *
 * @returns {import('vite').UserConfigExport} The Vite configuration object.
 */
export default defineConfig({
  /**
   * List of Vite plugins used in the project.
   * - TailwindCSS for utility-first CSS
   * - React Router for SPA routing
   * - TypeScript path aliases
   * - AutoImport for automatic React and app module imports
   */
  plugins: [
	tailwindcss(),
	reactRouter(),
	tsconfigPaths(),
	AutoImport({
	  imports: ["react"],
	  dirs: [
		"./app/interfaces",
		"./app/models",
		"./app/hooks",
		"./app/store/hooks",
		"./app/**/interfaces",
		"./app/**/models",
		"./app/**/hooks",
	  ],
	  dts: "auto-imports.d.ts",
	}),
  ],
  /**
   * Module resolution configuration, including custom aliases.
   */
  resolve: {
	alias: {
	  // Custom aliases for HRNet modules can be defined here
	},
  },
  /**
   * CSS preprocessor options for SCSS.
   */
  css: {
	preprocessorOptions: {
	  scss: {
		// Modern SCSS configuration without additionalData
	  },
	},
  },
});
