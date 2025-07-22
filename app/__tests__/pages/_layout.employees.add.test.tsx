
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "~/store";
import EmployeesAdd from "../../pages/_layout.employees.add";

describe("EmployeesAdd", () => {
	it("rend la page d'ajout d'employé", () => {
		render(
			<Provider store={store}>
				<MemoryRouter>
					<EmployeesAdd />
				</MemoryRouter>
			</Provider>
		);
		// Vérifie que le heading principal contient le texte exact 'Ajouter un employé'
		expect(screen.getByRole("heading", { name: /ajouter un employé/i })).toBeInTheDocument();
	});
});
