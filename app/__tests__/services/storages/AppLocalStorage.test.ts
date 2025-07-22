
// Mock AppCrypto
jest.mock("~/appcrypto", () => ({
  AppCrypto: {
	encrypt: jest.fn(async (v) => `enc(${v})`),
	decrypt: jest.fn(async (v) => v.replace(/^enc\((.*)\)$/, "$1")),
  },
}));

// Mock logger
jest.mock("~/utils/logger", () => ({
  createLogger: () => ({ debug: jest.fn(), error: jest.fn(), warn: jest.fn() }),
}));

import AppLocalStorage from "../../../services/storages/AppLocalStorage";

describe("AppLocalStorage", () => {
	// Mock AppCrypto
	jest.mock("~/appcrypto", () => ({
		AppCrypto: {
			encrypt: jest.fn(async (v) => `enc(${v})`),
			decrypt: jest.fn(async (v) => v.replace(/^enc\((.*)\)$/, "$1")),
		},
	}));

	// Mock logger
	jest.mock("~/utils/logger", () => ({
		createLogger: () => ({ debug: jest.fn(), error: jest.fn(), warn: jest.fn() }),
	}));

	describe("AppLocalStorage", () => {
		beforeEach(() => {
			window.localStorage.clear();
		});

		it("set et get une valeur encryptée", async () => {
			await AppLocalStorage.set("clé", { foo: 42 });
			const val = await AppLocalStorage.get("clé");
			expect(val).toEqual({ foo: 42 });
			// Vérifie le flag d'encryptage
			const raw = window.localStorage.getItem("argent-bank-clé");
			expect(raw?.startsWith("__ENCRYPTED__:")).toBe(true);
		});

		it("get retourne null si la clé n'existe pas", async () => {
			const val = await AppLocalStorage.get("inconnue");
			expect(val).toBeNull();
		});

		it("remove supprime la clé", async () => {
			await AppLocalStorage.set("clé", 123);
			AppLocalStorage.remove("clé");
			expect(await AppLocalStorage.get("clé")).toBeNull();
		});

		it("has détecte la présence de la clé", async () => {
			expect(AppLocalStorage.has("clé")).toBe(false);
			await AppLocalStorage.set("clé", "valeur");
			expect(AppLocalStorage.has("clé")).toBe(true);
		});

		it("clear supprime toutes les clés de l'app", async () => {
			await AppLocalStorage.set("a", 1);
			await AppLocalStorage.set("b", 2);
			AppLocalStorage.clear();
			expect(AppLocalStorage.has("a")).toBe(false);
			expect(AppLocalStorage.has("b")).toBe(false);
		});

		it("get retourne la valeur brute si non encryptée", async () => {
			window.localStorage.setItem("argent-bank-test", JSON.stringify({ foo: "bar" }));
			const val = await AppLocalStorage.get("test");
			expect(val).toEqual({ foo: "bar" });
		});
	});
});