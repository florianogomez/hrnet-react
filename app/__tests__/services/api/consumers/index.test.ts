import * as consumers from '../../../../services/api/consumers/index';

describe('api/consumers/index', () => {
  it('should export API consumers', () => {
    expect(consumers).toBeDefined();
    expect(typeof consumers).toBe('object');
  });
});
