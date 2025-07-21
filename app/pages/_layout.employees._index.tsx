import PageTitle from "~/components/PageTitle";
import { EmployeesListView } from "~/modules/employee/views";

/**
 * EmployeesPage component for displaying the employee management list view.
 */
const EmployeesPage = () => {
	return (
		<>
			<PageTitle title="Gestion des employés" />
			<EmployeesListView />
		</>
	);
};

export default EmployeesPage;
