import { ApiModeEnum } from "~/enums/ApiModeEnum";

describe('ApiModeEnum', () => {
  it('contains the expected modes', () => {
    expect(ApiModeEnum.MOCK).toBeDefined();
    expect(ApiModeEnum.REAL).toBeDefined();
  });

  it('is a TypeScript enum object', () => {
    expect(typeof ApiModeEnum).toBe('object');
  });
});
