import PageTitle from "~/components/PageTitle";
import { lazy, Suspense } from "react";
const EmployeesListView = lazy(() => import("~/modules/employee/views/EmployeesListView"));

/**
 * EmployeesPage component for displaying the employee management list view.
 */
const EmployeesPage = () => {
  return (
	<>
	  <PageTitle title="Employee management" />
	  <Suspense fallback={<div>Loading…</div>}>
		<EmployeesListView />
	  </Suspense>
	</>
  );
};

export default EmployeesPage;
