import UnauthorizedApiError from "../../../../services/api/errors/UnauthorizedApiError";

describe("UnauthorizedApiError", () => {
  it("doit être une instance d'Error", () => {
    const err = new UnauthorizedApiError({
      status: 401,
      message: "UnauthorizedApiError",
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("UnauthorizedApiError");
    expect(err.code).toBe(401);
  });
});
