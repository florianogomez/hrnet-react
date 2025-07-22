import PageTitle from "~/components/PageTitle";
import { lazy, Suspense } from "react";
const EmployeesAddView = lazy(() => import("~/modules/employee/views/EmployeesAddView"));



/**
 * EmployeesAddPage component for displaying the add employee view.
 */
const EmployeesAddPage = () => {
  return (
    <>
      <PageTitle title="Add employee" />
      <Suspense fallback={<div>Loading…</div>}>
        <EmployeesAddView />
      </Suspense>
    </>
  );
};

export default EmployeesAddPage;
