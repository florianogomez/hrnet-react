import BadRequestApiError from '../../../../services/api/errors/BadRequestApiError';

describe('BadRequestApiError', () => {
  it('doit être une instance d\'Error', () => {
    const err = new BadRequestApiError({
			status: 400,
			message: "BadRequestApiError",
		});
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('BadRequestApiError');
    expect(err.code).toBe(400);
  });
});
