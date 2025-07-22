

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "~/store";
import EmployeesIndex from "../../pages/_layout.employees._index";

describe("EmployeesIndex", () => {
  it("renders the employee list page", () => {
		render(
			<Provider store={store}>
				<MemoryRouter>
					<EmployeesIndex />
				</MemoryRouter>
			</Provider>
		);
	// Checks that the main heading contains the expected text
	expect(screen.getByRole("heading", { name: /employee|employees/i })).toBeInTheDocument();
	});
});
