import * as clients from '../../../../services/api/clients/index';

describe('api/clients/index', () => {
  it('should export API clients', () => {
    expect(clients).toBeDefined();
    expect(typeof clients).toBe('object');
  });
});
