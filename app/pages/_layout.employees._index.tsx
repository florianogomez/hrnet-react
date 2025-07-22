import PageTitle from "~/components/PageTitle";
import { lazy, Suspense } from "react";
const EmployeesListView = lazy(() => import("~/modules/employee/views/EmployeesListView"));

/**
 * EmployeesPage component for displaying the employee management list view.
 */
const EmployeesPage = () => {
  return (
	<>
	  <PageTitle title="Gestion des employés" />
	  <Suspense fallback={<div>Chargement…</div>}>
		<EmployeesListView />
	  </Suspense>
	</>
  );
};

export default EmployeesPage;
