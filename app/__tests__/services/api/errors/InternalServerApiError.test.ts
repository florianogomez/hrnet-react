import InternalServerApiError from "../../../../services/api/errors/InternalServerApiError";

describe("InternalServerApiError", () => {
  it("should be an instance of Error", () => {
    const err = new InternalServerApiError({
      status: 500,
      message: "InternalServerApiError",
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("InternalServerApiError");
    expect(err.code).toBe(500);
  });
});
