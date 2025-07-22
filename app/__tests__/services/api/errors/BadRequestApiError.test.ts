import BadRequestApiError from '../../../../services/api/errors/BadRequestApiError';

describe('BadRequestApiError', () => {
  it('should be an instance of Error', () => {
    const err = new BadRequestApiError({
      status: 400,
      message: "BadRequestApiError",
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('BadRequestApiError');
    expect(err.code).toBe(400);
  });
});
