import { hrnetApiClient } from '../../../../services/api/clients/hrnetApiClient';

describe('hrnetApiClient', () => {
  it('should be a configured axios client', () => {
    expect(hrnetApiClient).toBeDefined();
    expect(['object', 'function']).toContain(typeof hrnetApiClient);
    expect(hrnetApiClient).toHaveProperty('get');
    expect(hrnetApiClient).toHaveProperty('post');
    expect(hrnetApiClient).toHaveProperty('interceptors');
  });
});
