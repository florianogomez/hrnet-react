import ConflictApiError from "../../../../services/api/errors/ConflictApiError";

describe("ConflictApiError", () => {
	it("doit être une instance d'Error", () => {
		const err = new ConflictApiError({
			status: 409,
			message: "ConflictApiError",
		});
		expect(err).toBeInstanceOf(Error);
		expect(err.message).toBe("ConflictApiError");
		expect(err.code).toBe(409);
	});
});
