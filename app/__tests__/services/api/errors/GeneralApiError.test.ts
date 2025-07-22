import { AxiosError } from "axios";
import GeneralApiError from "../../../../services/api/errors/GeneralApiError";

describe("GeneralApiError", () => {
	it("doit être une instance d'Error", () => {
		// Création d'une instance AxiosError conforme à la signature
		const axiosError = new AxiosError(
			"GeneralApiError", // message
			undefined, // code
			undefined, // config
			undefined, // request
			{
				status: 409,
				data: {},
				statusText: "",
				headers: new (require("axios").AxiosHeaders)(),
				config: { headers: new (require("axios").AxiosHeaders)() },
			} // response
		);
		const err = new GeneralApiError(axiosError, {
			message: "GeneralApiError",
		});
		expect(err).toBeInstanceOf(Error);
		expect(err.message).toBe("GeneralApiError");
		expect(err.code).toBe(409);
	});
});
