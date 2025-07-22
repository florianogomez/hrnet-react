

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "~/store";
import EmployeesIndex from "../../pages/_layout.employees._index";

describe("EmployeesIndex", () => {
	it("rend la page de liste des employés", () => {
		render(
			<Provider store={store}>
				<MemoryRouter>
					<EmployeesIndex />
				</MemoryRouter>
			</Provider>
		);
		// Vérifie que le heading principal contient le texte attendu
		expect(screen.getByRole("heading", { name: /employé|employés/i })).toBeInTheDocument();
	});
});
