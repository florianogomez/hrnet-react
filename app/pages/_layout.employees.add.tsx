import PageTitle from "~/components/PageTitle";
import { lazy, Suspense } from "react";
const EmployeesAddView = lazy(() => import("~/modules/employee/views/EmployeesAddView"));



/**
 * EmployeesAddPage component for displaying the add employee view.
 */
const EmployeesAddPage = () => {
  return (
    <>
      <PageTitle title="Ajouter un employé" />
      <Suspense fallback={<div>Chargement…</div>}>
        <EmployeesAddView />
      </Suspense>
    </>
  );
};

export default EmployeesAddPage;
