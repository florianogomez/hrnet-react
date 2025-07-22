import ForbiddenApiError from "../../../../services/api/errors/ForbiddenApiError";

describe("ForbiddenApiError", () => {
  it("should be an instance of Error", () => {
		const err = new ForbiddenApiError({
			message: "ForbiddenApiError",
		});
		expect(err).toBeInstanceOf(Error);
		expect(err.message).toBe("ForbiddenApiError");
		expect(err.code).toBe(403);
	});
});
