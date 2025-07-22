import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { MemoryRouter } from "react-router";
import Layout from "../../pages/_layout";

describe("Layout", () => {
  it("renders the main layout", () => {
	render(
	  <MemoryRouter>
		<Layout />
	  </MemoryRouter>
	);
	// Add here specific assertions for the layout structure
	expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
