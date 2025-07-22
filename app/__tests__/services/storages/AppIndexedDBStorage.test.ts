import AppIndexedDBStorage from '../../../services/storages/AppIndexedDBStorage';

// Mock logger
jest.mock('~/utils/logger', () => ({ createLogger: () => ({ debug: jest.fn(), error: jest.fn(), warn: jest.fn() }) }));

describe('AppIndexedDBStorage', () => {
  jest.setTimeout(20000);
  let store: Record<string, string> = {};
  let storeKeys: string[] = [];

  beforeAll(() => {
    // Mock window.indexedDB
    const fakeDB = {
      objectStoreNames: { contains: jest.fn(() => true) },
      transaction: jest.fn(() => ({ objectStore: jest.fn(() => fakeStore) })),
      close: jest.fn(),
    };
    const fakeStore = {
      put: jest.fn((val, key) => ({ onsuccess: null, onerror: null })),
      get: jest.fn((key) => ({ onsuccess: null, onerror: null, result: store[key] })),
      delete: jest.fn((key) => ({ onsuccess: null, onerror: null })),
      getKey: jest.fn((key) => ({ onsuccess: null, onerror: null, result: store[key] !== undefined ? key : undefined })),
      clear: jest.fn(() => ({ onsuccess: null, onerror: null })),
    };
    Object.defineProperty(window, 'indexedDB', {
      value: {
        open: jest.fn(() => ({
          result: fakeDB,
          onupgradeneeded: null,
          onsuccess: null,
          onerror: null,
        })),
      },
      configurable: true,
    });
    // Patch getStore to use fakeStore
    jest.spyOn(AppIndexedDBStorage as any, 'getStore').mockImplementation(async (mode: any) => fakeStore);
  });

  beforeEach(() => {
    store = {};
    storeKeys = [];
  });

  it('set et get une valeur', async () => {
    // Simule le put
    (AppIndexedDBStorage as any).getStore.mockResolvedValueOnce({
      put: (val: string, key: string) => {
        store[key] = val;
        const req: any = {};
        setTimeout(() => req.onsuccess && req.onsuccess(), 0);
        return req;
      },
    });
    await AppIndexedDBStorage.set('clé', { foo: 42 });
    (AppIndexedDBStorage as any).getStore.mockResolvedValueOnce({
      get: (key: string) => {
        const req: any = { result: store[key] };
        setTimeout(() => req.onsuccess && req.onsuccess(), 0);
        return req;
      },
    });
    const val = await AppIndexedDBStorage.get('clé');
    expect(val).toEqual({ foo: 42 });
  });

  it('remove supprime la clé', async () => {
    store['clé'] = JSON.stringify('valeur');
    (AppIndexedDBStorage as any).getStore.mockResolvedValueOnce({
      delete: (key: string) => {
        delete store[key];
        const req: any = {};
        setTimeout(() => req.onsuccess && req.onsuccess(), 0);
        return req;
      },
    });
    await AppIndexedDBStorage.remove('clé');
    expect(store['clé']).toBeUndefined();
  });

  it('has détecte la présence de la clé', async () => {
    store['clé'] = JSON.stringify('valeur');
    (AppIndexedDBStorage as any).getStore.mockResolvedValueOnce({
      getKey: (key: string) => {
        const req: any = { result: store[key] !== undefined ? key : undefined };
        setTimeout(() => req.onsuccess && req.onsuccess(), 0);
        return req;
      },
    });
    const exists = await AppIndexedDBStorage.has('clé');
    expect(exists).toBe(true);
  });

  it('clear supprime tout', async () => {
    store['a'] = '1';
    store['b'] = '2';
    (AppIndexedDBStorage as any).getStore.mockResolvedValueOnce({
      clear: () => {
        store = {};
        const req: any = {};
        setTimeout(() => req.onsuccess && req.onsuccess(), 0);
        return req;
      },
    });
    await AppIndexedDBStorage.clear();
    expect(Object.keys(store)).toHaveLength(0);
  });
});
