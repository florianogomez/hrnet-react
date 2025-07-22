import { ApiHttpMethodEnum } from '../../../../services/api/enums/ApiHttpMethodEnum';

describe('ApiHttpMethodEnum', () => {
  it('contient toutes les méthodes HTTP attendues', () => {
    expect(ApiHttpMethodEnum.GET).toBeDefined();
    expect(ApiHttpMethodEnum.POST).toBeDefined();
    expect(ApiHttpMethodEnum.PUT).toBeDefined();
    expect(ApiHttpMethodEnum.DELETE).toBeDefined();
  });

  it('est un objet enum TypeScript', () => {
    expect(typeof ApiHttpMethodEnum).toBe('object');
    expect(Object.values(ApiHttpMethodEnum)).toEqual(
      expect.arrayContaining(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
    );
  });
});
