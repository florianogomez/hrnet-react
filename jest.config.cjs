module.exports = {
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"^~/(.*)$": "<rootDir>/app/$1",
		// Prend en charge tous les imports CSS/SCSS (node_modules inclus)
		"\\.(css|scss)$": "identity-obj-proxy",
		"^.+\\.css$": "identity-obj-proxy",
		"\\.(css|scss)$": "jest-transform-stub",
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "<rootDir>/jest.polyfill.ts"],
	transform: {
		"^.+\\.[jt]sx?$": "babel-jest",
	},
	extensionsToTreatAsEsm: [".ts", ".tsx"],
};
