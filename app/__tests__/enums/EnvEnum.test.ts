import { EnvEnum } from "~/enums/EnvEnum";

describe('EnvEnum', () => {
  it('contains the expected environments', () => {
    expect(EnvEnum.DEV).toBeDefined();
    expect(EnvEnum.PROD).toBeDefined();
  });

  it('is a TypeScript enum object', () => {
    expect(typeof EnvEnum).toBe('object');
  });
});
