import PageTitle from "~/components/PageTitle";
import { EmployeesAddView } from "~/modules/employee/views";



/**
 * EmployeesAddPage component for displaying the add employee view.
 */
const EmployeesAddPage = () => {
  return (
    <>
      <PageTitle title="Ajouter un employé" />
      <EmployeesAddView />
    </>
  );
};

export default EmployeesAddPage;
