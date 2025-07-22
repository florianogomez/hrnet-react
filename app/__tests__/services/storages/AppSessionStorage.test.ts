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

  it('set et get une valeur encryptée', async () => {
    await AppSessionStorage.set('clé', { foo: 42 });
    const val = await AppSessionStorage.get('clé');
    expect(val).toEqual({ foo: 42 });
    const raw = window.sessionStorage.getItem('argent-bank-clé');
    expect(raw?.startsWith('__ENCRYPTED__:')).toBe(true);
  });

  it('get retourne null si la clé n\'existe pas', async () => {
    const val = await AppSessionStorage.get('inconnue');
    expect(val).toBeNull();
  });

  it('remove supprime la clé', async () => {
    await AppSessionStorage.set('clé', 123);
    await new Promise(r => setTimeout(r, 0));
    AppSessionStorage.remove('clé');
    await new Promise(r => setTimeout(r, 0));
    expect(window.sessionStorage.getItem('argent-bank-clé')).toBeNull();
  });

  it('has détecte la présence de la clé', async () => {
    expect(AppSessionStorage.has('clé')).toBe(false);
    await AppSessionStorage.set('clé', 'valeur');
    await new Promise(r => setTimeout(r, 0));
    expect(window.sessionStorage.getItem('argent-bank-clé')).not.toBeNull();
  });

  it('clear supprime toutes les clés de l\'app', async () => {
    await AppSessionStorage.set('a', 1);
    await AppSessionStorage.set('b', 2);
    AppSessionStorage.clear();
    expect(AppSessionStorage.has('a')).toBe(false);
    expect(AppSessionStorage.has('b')).toBe(false);
  });

  it('get retourne la valeur brute si non encryptée', async () => {
    window.sessionStorage.setItem('argent-bank-test', JSON.stringify({ foo: 'bar' }));
    const val = await AppSessionStorage.get('test');
    expect(val).toEqual({ foo: 'bar' });
  });

  it('setAuthToken et getAuthToken', async () => {
    await AppSessionStorage.setAuthToken('tok');
    const val = await AppSessionStorage.getAuthToken();
    expect(val).toBe('tok');
  });

  it('getAuthToken retourne le token après setAuthToken', async () => {
    expect(await AppSessionStorage.getAuthToken()).toBeNull();
    await AppSessionStorage.setAuthToken('tok');
    await new Promise(r => setTimeout(r, 0));
    const token = await AppSessionStorage.getAuthToken();
    expect(token).toBe('tok');
  });

  it('setUserData et getUserData', async () => {
    await AppSessionStorage.setUserData({ name: 'bob' });
    const val = await AppSessionStorage.getUserData();
    expect(val).toEqual({ name: 'bob' });
  });

  it('clearAuth supprime le token et les données utilisateur', async () => {
    await AppSessionStorage.setAuthToken('tok');
    await AppSessionStorage.setUserData({ name: 'bob' });
    await new Promise(r => setTimeout(r, 0));
    AppSessionStorage.clearAuth();
    expect(window.sessionStorage.getItem(AppSessionStorage.AUTH_TOKEN_KEY)).toBeNull();
    expect(window.sessionStorage.getItem(AppSessionStorage.USER_DATA_KEY)).toBeNull();
  });
});
