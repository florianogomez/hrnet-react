import { useState, useRef, useCallback } from "react";
import { createLogger } from "~/utils/logger";
import { useNavigate } from "react-router-dom";
import type { EmployeeCreateApiPayloadInterface } from "../interfaces/EmployeeCreateApiPayloadInterface";
import { EmployeeForm } from "../components";
import { createEmployeeAction } from "../actions/createEmployeeAction";
import { faker } from "@faker-js/faker";
import { appRoutes } from '~/appRoutes';
import { AppConfirmationModal } from '~/components/AppConfirmationModal';


/**
 * Logger instance for EmployeesAddView.
 */
const logger = createLogger("EmployeesAddView");


/**
 * EmployeesAddView component for creating a new employee.
 * Provides a form with initial values (using Faker.js) and handles submission, cancellation, and success modal.
 */
export default function EmployeesAddView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /**
   * State for the success modal after employee creation.
   */
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    employeeName: ''
  });

  /**
   * Ref for aborting API requests if needed.
   */
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Initial form values for development, generated with Faker.js.
   */
  const initialValues = useRef<Partial<EmployeeCreateApiPayloadInterface>>({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    startDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
    department: faker.helpers.arrayElement(["Sales", "Marketing", "Engineering", "Human Resources", "Legal"]),
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode(),
  }).current;


  /**
   * Handles form submission to create a new employee.
   * @param data - The employee data from the form.
   */
  const submit = async (data: EmployeeCreateApiPayloadInterface) => {
    try {
      setLoading(true);
      // Cancel previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const ctrl = new AbortController();
      abortControllerRef.current = ctrl;
      logger.info("Creating employee:", { firstName: data.firstName, lastName: data.lastName });
      const createdEmployee = await createEmployeeAction(data);
      abortControllerRef.current = null;
      if (createdEmployee && !(createdEmployee instanceof Error)) {
        logger.info("Employee created successfully", { id: createdEmployee.id });
        // Show success modal
        setSuccessModal({
          isOpen: true,
          employeeName: `${data.firstName} ${data.lastName}`
        });
      } else {
        throw new Error("Failed to create employee");
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        logger.info("Request was cancelled");
        return;
      }
      logger.error("Error creating employee:", error);
      alert("Error while creating employee");
      throw error;
    } finally {
      setLoading(false);
    }
  };


  /**
   * Handles form data changes for debugging purposes.
   * @param data - The partial employee data from the form.
   */
  const handleChange = useCallback((data: Partial<EmployeeCreateApiPayloadInterface>) => {
    logger.debug("Form data changed", { 
      firstName: data.firstName, 
      lastName: data.lastName 
    });
  }, []);


  /**
   * Handles cancellation of employee creation and navigates back to the list.
   */
  const handleCancel = () => {
    logger.info("Employee creation cancelled");
    navigate(appRoutes.employees.list);
  };


  /**
   * Handles confirmation of the success modal and navigates to the employee list.
   */
  const handleSuccessModalConfirm = () => {
    setSuccessModal({ isOpen: false, employeeName: '' });
    navigate(appRoutes.employees.list);
  };

  /**
   * Handles cancellation of the success modal (stays on the add view).
   */
  const handleSuccessModalCancel = () => {
    setSuccessModal({ isOpen: false, employeeName: '' });
  };

  return (
    <div className="employees-add-view">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <EmployeeForm
              initialValues={initialValues}
              onSubmit={submit}
              onChange={handleChange}
              processing={loading}
              isEditing={false}
              submitLabel="Create employee"
              onCancel={handleCancel}
            />

            {/* Success modal */}
            <AppConfirmationModal
              title="Employee created successfully!"
              content={
                <div className="text-center">
                  <div className="mb-3">
                    <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <p className="mb-0">
                    The employee <strong>{successModal.employeeName}</strong> has been successfully created in the system.
                  </p>
                </div>
              }
              isOpen={successModal.isOpen}
              confirmLabel="Go to the list"
              cancelLabel="Add another"
              processing={false}
              confirmButtonColor="success"
              cancelButtonColor="primary"
              onConfirm={handleSuccessModalConfirm}
              onCancel={handleSuccessModalCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
