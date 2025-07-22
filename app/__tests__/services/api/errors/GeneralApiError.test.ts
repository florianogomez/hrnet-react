import { AxiosError } from "axios";
import GeneralApiError from "../../../../services/api/errors/GeneralApiError";

describe("GeneralApiError", () => {
  it("should be an instance of Error", () => {
	// Create an AxiosError instance matching the signature
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
