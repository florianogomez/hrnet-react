import * as clients from '../../../../services/api/clients/index';

describe('api/clients/index', () => {
  it('doit exporter des clients API', () => {
    expect(clients).toBeDefined();
    expect(typeof clients).toBe('object');
  });
});
