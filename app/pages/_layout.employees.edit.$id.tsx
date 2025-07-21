import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "~/components/PageTitle";
import EmployeesEditView from "~/modules/employee/views/EmployeesEditView";
import { appRoutes } from "~/appRoutes";

/**
 * EditEmployeePage component for editing an employee by ID.
 * Redirects to the employee list if no ID is provided.
 */
const EditEmployeePage = () => {
	const { id: employeeId } = useParams<{ id: string }>();
	const navigate = useNavigate();

	if (!employeeId) {
		navigate("/employees");
		return null;
	}

	return (
		<>
			<PageTitle
				title="Éditer un employé"
				subTitle="Employés"
				subTitleRoute={appRoutes.employees.list}
			/>
			<EmployeesEditView />
		</>
	);
};

export default EditEmployeePage;
