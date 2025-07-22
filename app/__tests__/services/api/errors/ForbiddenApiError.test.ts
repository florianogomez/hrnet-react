import ForbiddenApiError from "../../../../services/api/errors/ForbiddenApiError";

describe("ForbiddenApiError", () => {
	it("doit être une instance d'Error", () => {
		const err = new ForbiddenApiError({
			message: "ForbiddenApiError",
		});
		expect(err).toBeInstanceOf(Error);
		expect(err.message).toBe("ForbiddenApiError");
		expect(err.code).toBe(403);
	});
});
