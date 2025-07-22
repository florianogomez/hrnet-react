import { ApiModeEnum } from "~/enums/ApiModeEnum";

describe('ApiModeEnum', () => {
  it('contient les modes attendus', () => {
    expect(ApiModeEnum.MOCK).toBeDefined();
    expect(ApiModeEnum.REAL).toBeDefined();
  });

  it('est un objet enum TypeScript', () => {
    expect(typeof ApiModeEnum).toBe('object');
  });
});
