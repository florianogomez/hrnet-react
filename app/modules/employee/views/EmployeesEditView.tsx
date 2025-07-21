import { useEffect, useRef, useCallback, useState } from "react";
import { createLogger } from "~/utils/logger";
import { useNavigate, useParams } from "react-router-dom";
import type { EmployeeCreateApiPayloadInterface } from "../interfaces/EmployeeCreateApiPayloadInterface";
import type { EmployeeInterface } from "../interfaces/EmployeeInterface";
import { EmployeeForm } from "../components";
import { EmployeeModel } from "../models";
import { findEmployeeAction } from "../actions/findEmployeeAction";
import { AppConfirmationModal } from '~/components/AppConfirmationModal';
import { updateEmployeeAction } from "../actions/updateEmployeeAction";
import { appRoutes } from '~/appRoutes';


/**
 * Logger instance for EmployeesEditView.
 */
const logger = createLogger("EmployeesEditView");


/**
 * EmployeesEditView component for editing an existing employee.
 * Handles loading, updating, and displaying the employee form and success modal.
 */
export default function EmployeesEditView() {
  /**
   * Handles confirmation of the success modal and navigates to the employee list.
   */
  const handleSuccessModalConfirm = () => {
    setSuccessModal({ isOpen: false, employeeName: '' });
    navigate(appRoutes.employees.list);
  };

  /**
   * Handles cancellation of the success modal (stays on the edit view).
   */
  const handleSuccessModalCancel = () => {
    setSuccessModal({ isOpen: false, employeeName: '' });
  };

  /**
   * State for the success modal after employee update.
   */
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    employeeName: ''
  });
  const navigate = useNavigate();
  const { id: employeeId } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [finding, setFinding] = useState(false);
  const [employee, setEmployee] = useState<EmployeeModel | null>(null);

  /**
   * Ref for aborting API requests if needed.
   */
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Cancels any pending API requests.
   */
  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Loads the employee to edit on mount or when employeeId changes.
   */
  useEffect(() => {
    const loadEmployee = async () => {
      if (!employeeId) {
        logger.error("No employee ID provided");
        navigate(appRoutes.employees.list);
        return;
      }
      try {
        setFinding(true);
        logger.info("Loading employee for edit:", { employeeId });
        const result = await findEmployeeAction(employeeId);
        if (result instanceof Error) {
          logger.error("Failed to load employee:", result);
          alert("Error loading employee");
          navigate(appRoutes.employees.list);
        } else if (result) {
          logger.info("Employee loaded successfully");
          setEmployee(result);
        } else {
          logger.warn("Employee not found");
          alert("Employee not found");
          navigate(appRoutes.employees.list);
        }
      } catch (error) {
        logger.error("Error loading employee:", error);
        alert("Error loading employee");
        navigate(appRoutes.employees.list);
      } finally {
        setFinding(false);
      }
    };
    loadEmployee();
    // Cleanup: abort pending requests if component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [employeeId, navigate]);

  /**
   * Handles form submission to update the employee.
   * @param data - The updated employee data from the form.
   */
  const submit = async (data: EmployeeCreateApiPayloadInterface) => {
    if (!employeeId || !employee) {
      logger.error("Cannot update: missing employee ID or data");
      return;
    }
    try {
      setLoading(true);
      // Cancel previous request if any
      cancelPendingRequests();
      const ctrl = new AbortController();
      abortControllerRef.current = ctrl;
      logger.info("Updating employee:", { employeeId, firstName: data.firstName, lastName: data.lastName });
      const updated = await updateEmployeeAction(employeeId, data);
      abortControllerRef.current = null;
      if (updated && !(updated instanceof Error)) {
        logger.info("Employee updated successfully");
        setEmployee(updated);
        // Show success modal
        setSuccessModal({
          isOpen: true,
          employeeName: `${data.firstName} ${data.lastName}`
        });
      } else {
        throw new Error("Failed to update employee");
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        logger.info('Update request was cancelled');
        return;
      }
      logger.error("Error updating employee:", error);
      alert("Error updating employee");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form data changes for debugging and live update.
   * @param updatedData - The partial updated employee data from the form.
   */
  const handleFormChange = useCallback((updatedData: Partial<EmployeeCreateApiPayloadInterface>) => {
    if (employee) {
      const employeeData = employee.interface as EmployeeInterface;
      // Check if data has changed
      const isChanged = Object.entries(updatedData).some(
        ([key, value]) => employeeData[key as keyof EmployeeInterface] !== value
      );
      if (isChanged) {
        const updatedModel = new EmployeeModel({
          ...employeeData,
          ...updatedData,
        });
        setEmployee(updatedModel);
      }
    }
  }, [employee]);

  /**
   * Handles cancellation of employee editing and navigates back to the list.
   */
  const handleCancel = () => {
    logger.info("Employee edit cancelled");
    navigate(appRoutes.employees.list);
  };


  /**
   * Renders a loading spinner while the employee is being loaded.
   */
  if (finding && !employee) {
    return (
      <div className="employees-edit-view">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Loading employee data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders an error alert if the employee is not found.
   */
  if (!employee) {
    return (
      <div className="employees-edit-view">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger">
                Employee not found
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const employeeData = employee.interface as EmployeeInterface;

  return (
    <div className="employees-edit-view">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <EmployeeForm
              initialValues={{
                firstName: employeeData.firstName || "",
                lastName: employeeData.lastName || "",
                dateOfBirth: employeeData.dateOfBirth || "",
                startDate: employeeData.startDate || "",
                department: employeeData.department || "Sales",
                street: employeeData.street || "",
                city: employeeData.city || "",
                state: employeeData.state || "AL",
                zipCode: employeeData.zipCode || "",
              }}
              onSubmit={submit}
              onChange={handleFormChange}
              submitLabel="Mettre à jour"
              processing={loading}
              isEditing={true}
              employeeId={employeeId}
              onCancel={handleCancel}
            />

            {/* Modale de succès */}
            <AppConfirmationModal
              title="Employé mis à jour avec succès !"
              content={
                <div className="text-center">
                  <div className="mb-3">
                    <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <p className="mb-0">
                    L'employé <strong>{successModal.employeeName}</strong> a été mis à jour avec succès dans le système.
                  </p>
                </div>
              }
              isOpen={successModal.isOpen}
              confirmLabel="Aller à la liste"
              cancelLabel="Continuer l'édition"
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
