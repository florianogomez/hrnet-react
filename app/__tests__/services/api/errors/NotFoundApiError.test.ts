import NotFoundApiError from "../../../../services/api/errors/NotFoundApiError";

describe("NotFoundApiError", () => {
  it("should be an instance of Error", () => {
    const err = new NotFoundApiError('app/route', {
      status: 404,
      message: "NotFoundApiError",
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("NotFoundApiError");
    expect(err.code).toBe(404);
  });
});
