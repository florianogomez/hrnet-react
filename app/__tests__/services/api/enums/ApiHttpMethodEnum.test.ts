import { ApiHttpMethodEnum } from '../../../../services/api/enums/ApiHttpMethodEnum';

describe('ApiHttpMethodEnum', () => {
  it('contains all expected HTTP methods', () => {
    expect(ApiHttpMethodEnum.GET).toBeDefined();
    expect(ApiHttpMethodEnum.POST).toBeDefined();
    expect(ApiHttpMethodEnum.PUT).toBeDefined();
    expect(ApiHttpMethodEnum.DELETE).toBeDefined();
  });

  it('is a TypeScript enum object', () => {
    expect(typeof ApiHttpMethodEnum).toBe('object');
    expect(Object.values(ApiHttpMethodEnum)).toEqual(
      expect.arrayContaining(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
    );
  });
});
