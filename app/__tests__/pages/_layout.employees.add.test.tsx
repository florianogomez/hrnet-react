
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "~/store";
import EmployeesAdd from "../../pages/_layout.employees.add";

describe("EmployeesAdd", () => {
  it("renders the add employee page", () => {
		render(
			<Provider store={store}>
				<MemoryRouter>
					<EmployeesAdd />
				</MemoryRouter>
			</Provider>
		);
	// Checks that the main heading contains the exact text 'Add employee'
	expect(screen.getByRole("heading", { name: /add employee/i })).toBeInTheDocument();
	});
});
