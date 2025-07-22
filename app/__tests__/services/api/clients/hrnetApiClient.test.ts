import { hrnetApiClient } from '../../../../services/api/clients/hrnetApiClient';

describe('hrnetApiClient', () => {
  it('doit être un client axios configuré', () => {
    expect(hrnetApiClient).toBeDefined();
    expect(['object', 'function']).toContain(typeof hrnetApiClient);
    expect(hrnetApiClient).toHaveProperty('get');
    expect(hrnetApiClient).toHaveProperty('post');
    expect(hrnetApiClient).toHaveProperty('interceptors');
  });
});
