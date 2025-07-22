import { AlertVariantEnum } from '../../enums/AlertVariantEnum';

describe('AlertVariantEnum', () => {
  it('contains all expected variants', () => {
    expect(AlertVariantEnum.PRIMARY).toBe('primary');
    expect(AlertVariantEnum.SECONDARY).toBe('secondary');
    expect(AlertVariantEnum.INFO).toBe('info');
    expect(AlertVariantEnum.SUCCESS).toBe('success');
    expect(AlertVariantEnum.WARNING).toBe('warning');
    expect(AlertVariantEnum.ERROR).toBe('error');
  });

  it('is a TypeScript enum object', () => {
    expect(typeof AlertVariantEnum).toBe('object');
    expect(Object.values(AlertVariantEnum)).toEqual(
      expect.arrayContaining(['primary', 'secondary', 'info', 'success', 'warning', 'error'])
    );
  });
});
