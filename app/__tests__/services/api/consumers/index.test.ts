import * as consumers from '../../../../services/api/consumers/index';

describe('api/consumers/index', () => {
  it('doit exporter des consommateurs d\'API', () => {
    expect(consumers).toBeDefined();
    expect(typeof consumers).toBe('object');
  });
});
