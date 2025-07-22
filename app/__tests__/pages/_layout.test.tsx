import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { MemoryRouter } from "react-router";
import Layout from "../../pages/_layout";

describe("Layout", () => {
  it("rend le layout principal", () => {
	render(
	  <MemoryRouter>
		<Layout />
	  </MemoryRouter>
	);
	// Ajoute ici des assertions spécifiques à la structure du layout
	expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
