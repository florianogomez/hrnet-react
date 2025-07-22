import AppSessionStorage from '../../../services/storages/AppSessionStorage';

// Mock AppCrypto
jest.mock('~/appcrypto', () => ({
  AppCrypto: {
    encrypt: jest.fn(async (v) => `enc(${v})`),
    decrypt: jest.fn(async (v) => v.replace(/^enc\((.*)\)$/, '$1')),
  },
}));

// Mock logger
jest.mock('~/utils/logger', () => ({ createLogger: () => ({ debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() }) }));

describe('AppSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('set and get an encrypted value', async () => {
    await AppSessionStorage.set('key', { foo: 42 });
    const val = await AppSessionStorage.get('key');
    expect(val).toEqual({ foo: 42 });
    const raw = window.sessionStorage.getItem('argent-bank-key');
    expect(raw?.startsWith('__ENCRYPTED__:')).toBe(true);
  });

  it('get returns null if the key does not exist', async () => {
    const val = await AppSessionStorage.get('unknown');
    expect(val).toBeNull();
  });

  it('remove deletes the key', async () => {
    await AppSessionStorage.set('key', 123);
    await new Promise(r => setTimeout(r, 0));
    AppSessionStorage.remove('key');
    await new Promise(r => setTimeout(r, 0));
    expect(window.sessionStorage.getItem('argent-bank-key')).toBeNull();
  });

  it('has detects the presence of the key', async () => {
    expect(AppSessionStorage.has('key')).toBe(false);
    await AppSessionStorage.set('key', 'value');
    await new Promise(r => setTimeout(r, 0));
    expect(window.sessionStorage.getItem('argent-bank-key')).not.toBeNull();
  });

  it('clear removes all app keys', async () => {
    await AppSessionStorage.set('a', 1);
    await AppSessionStorage.set('b', 2);
    AppSessionStorage.clear();
    expect(AppSessionStorage.has('a')).toBe(false);
    expect(AppSessionStorage.has('b')).toBe(false);
  });

  it('get returns the raw value if not encrypted', async () => {
    window.sessionStorage.setItem('argent-bank-test', JSON.stringify({ foo: 'bar' }));
    const val = await AppSessionStorage.get('test');
    expect(val).toEqual({ foo: 'bar' });
  });

  it('setAuthToken and getAuthToken', async () => {
    await AppSessionStorage.setAuthToken('tok');
    const val = await AppSessionStorage.getAuthToken();
    expect(val).toBe('tok');
  });

  it('getAuthToken returns the token after setAuthToken', async () => {
    expect(await AppSessionStorage.getAuthToken()).toBeNull();
    await AppSessionStorage.setAuthToken('tok');
    await new Promise(r => setTimeout(r, 0));
    const token = await AppSessionStorage.getAuthToken();
    expect(token).toBe('tok');
  });

  it('setUserData and getUserData', async () => {
    await AppSessionStorage.setUserData({ name: 'bob' });
    const val = await AppSessionStorage.getUserData();
    expect(val).toEqual({ name: 'bob' });
  });

  it('clearAuth removes the token and user data', async () => {
    await AppSessionStorage.setAuthToken('tok');
    await AppSessionStorage.setUserData({ name: 'bob' });
    await new Promise(r => setTimeout(r, 0));
    AppSessionStorage.clearAuth();
    expect(window.sessionStorage.getItem(AppSessionStorage.AUTH_TOKEN_KEY)).toBeNull();
    expect(window.sessionStorage.getItem(AppSessionStorage.USER_DATA_KEY)).toBeNull();
  });
});
