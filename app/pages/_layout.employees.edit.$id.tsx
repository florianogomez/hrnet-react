import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "~/components/PageTitle";
import { lazy, Suspense } from "react";
const EmployeesEditView = lazy(() => import("~/modules/employee/views/EmployeesEditView"));
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
	  title="Edit employee"
	  subTitle="Employees"
	  subTitleRoute={appRoutes.employees.list}
	/>
	<Suspense fallback={<div>Loading…</div>}>
		<EmployeesEditView />
	  </Suspense>
	</>
  );
};

export default EditEmployeePage;
