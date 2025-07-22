import { EnvEnum } from "~/enums/EnvEnum";

describe('EnvEnum', () => {
  it('contient les environnements attendus', () => {
    expect(EnvEnum.DEV).toBeDefined();
    expect(EnvEnum.PROD).toBeDefined();
  });

  it('est un objet enum TypeScript', () => {
    expect(typeof EnvEnum).toBe('object');
  });
});
