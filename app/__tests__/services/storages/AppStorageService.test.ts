// Pour éviter les erreurs d'indexation implicite sur globalThis
declare global {
  // eslint-disable-next-line no-var
  var loggerInfoSpy: jest.Mock;
  // eslint-disable-next-line no-var
  var loggerDebugSpy: jest.Mock;
  // eslint-disable-next-line no-var
  var loggerErrorSpy: jest.Mock;
}

import AppIndexedDBStorage from "~/services/storages/AppIndexedDBStorage";
import AppSessionStorage from "~/services/storages/AppSessionStorage";
import { AppStorageService } from "~/services/storages/AppStorageService";

// Mock Redux store
jest.mock("~/store", () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({})),
  },
}));

// Logger spies (stockés sur globalThis pour Jest)
jest.mock("~/utils/logger", () => {
  globalThis.loggerInfoSpy = jest.fn();
  globalThis.loggerDebugSpy = jest.fn();
  globalThis.loggerErrorSpy = jest.fn();
  return {
    createLogger: () => ({
      info: globalThis.loggerInfoSpy,
      debug: globalThis.loggerDebugSpy,
      error: globalThis.loggerErrorSpy,
      warn: jest.fn(),
    }),
  };
});


describe("AppStorageService", () => {
  let service: AppStorageService;

  class TestStorageService extends AppStorageService {
    constructor() {
      super({ name: "test" });
    }
  }

  beforeEach(() => {
    globalThis.loggerInfoSpy.mockClear();
    globalThis.loggerDebugSpy.mockClear();
    globalThis.loggerErrorSpy.mockClear();
    // @ts-ignore
    jest.spyOn(AppSessionStorage, "get").mockResolvedValue(null);
    // @ts-ignore
    jest.spyOn(AppSessionStorage, "set").mockResolvedValue(undefined);
    // @ts-ignore
    jest.spyOn(AppSessionStorage, "remove").mockImplementation(() => {});
    // @ts-ignore
    jest.spyOn(AppSessionStorage, "clear").mockImplementation(() => {});
    // @ts-ignore
    jest.spyOn(AppIndexedDBStorage, "get").mockResolvedValue(null);
    // @ts-ignore
    jest.spyOn(AppIndexedDBStorage, "set").mockResolvedValue(undefined);
    // @ts-ignore
    jest.spyOn(AppIndexedDBStorage, "remove").mockResolvedValue(undefined);
    // @ts-ignore
    jest.spyOn(AppIndexedDBStorage, "clear").mockResolvedValue(undefined);
    jest.clearAllMocks();
    service = new TestStorageService();
  });

  it("should initialize with prefix and log info", () => {
    expect(service["prefix"]).toBe("test");
  });

  it("should return correct storageKey", () => {
    expect(service.storageKey).toBe("test-storage");
  });

  it("should compute storage key", () => {
    expect(service.computeStorageKey("foo")).toBe("test-storage-foo");
  });

  it("should set value in IndexedDB and dispatch to Redux if persistent", async () => {
    const redux = {
      selector: () => 123,
      action: jest.fn((v) => ({ type: "SET", payload: v })),
    };
    await service.set("foo", 123, { persistent: true, redux });
    expect(AppIndexedDBStorage.set).toHaveBeenCalledWith("test-storage-foo", 123);
    expect(redux.action).toHaveBeenCalledWith(123);
  });

  it("should set value in sessionStorage if not persistent", async () => {
    await service.set("bar", 456, { persistent: false });
    expect(AppSessionStorage.set).toHaveBeenCalledWith("test-storage-bar", 456);
  });

  it("should log error if set throws", async () => {
    (AppIndexedDBStorage.set as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    await service.set("err", 1, { persistent: true });
    expect(globalThis.loggerErrorSpy).toHaveBeenCalled();
  });

  it("should get value from sessionStorage and hydrate Redux", async () => {
    (AppSessionStorage.get as jest.Mock).mockResolvedValueOnce("val");
    const redux = { selector: () => undefined, action: jest.fn((v) => ({ type: "SET", payload: v })) };
    const result = await service.get("foo", { redux });
    expect(result).toBe("val");
    expect(redux.action).toHaveBeenCalledWith("val");
  });

  it("should get value from IndexedDB and hydrate Redux and sessionStorage", async () => {
    (AppSessionStorage.get as jest.Mock).mockResolvedValueOnce(null);
    (AppIndexedDBStorage.get as jest.Mock).mockResolvedValueOnce("val2");
    const redux = { selector: () => undefined, action: jest.fn((v) => ({ type: "SET", payload: v })) };
    const result = await service.get("foo", { redux });
    expect(result).toBe("val2");
    expect(redux.action).toHaveBeenCalledWith("val2");
    expect(AppSessionStorage.set).toHaveBeenCalledWith("test-storage-foo", "val2");
  });

  it("should get value from Redux selector if not in storage", async () => {
    (AppSessionStorage.get as jest.Mock).mockResolvedValueOnce(null);
    (AppIndexedDBStorage.get as jest.Mock).mockResolvedValueOnce(null);
    const redux = { selector: () => "reduxVal", action: jest.fn() };
    const result = await service.get("foo", { redux });
    expect(result).toBe("reduxVal");
  });

  it("should return null and log error if get throws", async () => {
    (AppSessionStorage.get as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    const result = await service.get("foo");
    expect(result).toBeNull();
    expect(globalThis.loggerErrorSpy).toHaveBeenCalled();
  });

  it("should remove from both storages", async () => {
    await service.remove("foo");
    expect(AppSessionStorage.remove).toHaveBeenCalledWith("test-storage-foo");
    expect(AppIndexedDBStorage.remove).toHaveBeenCalledWith("test-storage-foo");
  });

  it("should log error if remove throws", async () => {
    (AppIndexedDBStorage.remove as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    await service.remove("foo");
    expect(globalThis.loggerErrorSpy).toHaveBeenCalled();
  });

  it("should clear all keys with prefix from sessionStorage and localStorage", () => {
    const sessionKeys: Record<string, string> = { "test-storage-1": "a", "other": "b" };
    const localKeys: Record<string, string> = { "test-storage-2": "c", "other2": "d" };
    Object.defineProperty(window, "sessionStorage", {
      value: {
        ...sessionKeys,
        removeItem: jest.fn((key: string) => { delete sessionKeys[key]; }),
        key: (index: number) => Object.keys(sessionKeys)[index] || null,
        get length() { return Object.keys(sessionKeys).length; },
      },
      configurable: true,
    });
    Object.defineProperty(window, "localStorage", {
      value: {
        ...localKeys,
        removeItem: jest.fn((key: string) => { delete localKeys[key]; }),
        key: (index: number) => Object.keys(localKeys)[index] || null,
        get length() { return Object.keys(localKeys).length; },
      },
      configurable: true,
    });
    service.clear();
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith("test-storage-1");
    expect(window.localStorage.removeItem).toHaveBeenCalledWith("test-storage-2");
  });

  it("should log error if clear throws", () => {
    Object.defineProperty(window, "sessionStorage", {
      value: {
        ...window.sessionStorage,
        removeItem: () => { throw new Error("fail"); },
      },
      configurable: true,
    });
    service.clear();
    expect(globalThis.loggerErrorSpy).toHaveBeenCalled();
  });

  it("should clear all storages statically", async () => {
    await AppStorageService.clearAll();
    expect(AppSessionStorage.clear).toHaveBeenCalled();
    expect(AppIndexedDBStorage.clear).toHaveBeenCalled();
  });
});
