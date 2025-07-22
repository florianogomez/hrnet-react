import ConflictApiError from "../../../../services/api/errors/ConflictApiError";

describe("ConflictApiError", () => {
  it("should be an instance of Error", () => {
		const err = new ConflictApiError({
			status: 409,
			message: "ConflictApiError",
		});
		expect(err).toBeInstanceOf(Error);
		expect(err.message).toBe("ConflictApiError");
		expect(err.code).toBe(409);
	});
});
