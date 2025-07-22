
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

	it("set and get an encrypted value", async () => {
	  await AppLocalStorage.set("key", { foo: 42 });
	  const val = await AppLocalStorage.get("key");
	  expect(val).toEqual({ foo: 42 });
	  // Check the encryption flag
	  const raw = window.localStorage.getItem("argent-bank-key");
	  expect(raw?.startsWith("__ENCRYPTED__:")).toBe(true);
	});

	it("get returns null if the key does not exist", async () => {
	  const val = await AppLocalStorage.get("unknown");
	  expect(val).toBeNull();
	});

	it("remove deletes the key", async () => {
	  await AppLocalStorage.set("key", 123);
	  AppLocalStorage.remove("key");
	  expect(await AppLocalStorage.get("key")).toBeNull();
	});

	it("has detects the presence of the key", async () => {
	  expect(AppLocalStorage.has("key")).toBe(false);
	  await AppLocalStorage.set("key", "value");
	  expect(AppLocalStorage.has("key")).toBe(true);
	});

	it("clear removes all app keys", async () => {
	  await AppLocalStorage.set("a", 1);
	  await AppLocalStorage.set("b", 2);
	  AppLocalStorage.clear();
	  expect(AppLocalStorage.has("a")).toBe(false);
	  expect(AppLocalStorage.has("b")).toBe(false);
	});

	it("get returns the raw value if not encrypted", async () => {
	  window.localStorage.setItem("argent-bank-test", JSON.stringify({ foo: "bar" }));
	  const val = await AppLocalStorage.get("test");
	  expect(val).toEqual({ foo: "bar" });
	});
	});
});