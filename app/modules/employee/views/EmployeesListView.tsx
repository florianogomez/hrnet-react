import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeList, useEmployeeActions } from '../hooks';
import { EmployeeDataTable } from '../components';
import { AppConfirmationModal } from '~/components/AppConfirmationModal';
import Loader from '~/components/Loader';
import { createLogger } from "~/utils/logger";
import { appRoutes } from '~/appRoutes';


/**
 * Logger instance for EmployeesListView.
 */
const logger = createLogger("EmployeesListView");


/**
 * EmployeesListView component for displaying and managing the list of employees.
 * Handles loading, refreshing, navigation, and deletion actions.
 */
const EmployeesListView: React.FC = () => {
  const navigate = useNavigate();

  // Hooks for employee list, actions, and loading state
  const { loading, employees, loadEmployees } = useEmployeeList();
  const { handleDelete, handleBulkDelete, handleExport, confirmModal, closeModal } = useEmployeeActions();

  /**
   * Listen to loading state changes and log them.
   */
  useEffect(() => {
    logger.info("Loading state changed:", { loading });
  }, [loading]);

  /**
   * Load the initial employee list if empty.
   */
  useEffect(() => {
    if (employees.length === 0 && !loading) {
      loadEmployees();
    }
  }, [loadEmployees, employees.length, loading]);

  /**
   * Handler to refresh the employee list.
   */
  const handleRefresh = () => {
    logger.info("Refreshing employee list");
    loadEmployees();
  };

  /**
   * Handler to navigate to the edit employee view.
   * @param employeeId - The ID of the employee to edit.
   */
  const handleEdit = (employeeId: string) => {
    logger.info("Navigating to edit employee:", { employeeId });
    navigate(appRoutes.employees.edit(employeeId));
  };

  /**
   * Handler to navigate to the add employee view.
   */
  const handleAddEmployee = () => {
    logger.info("Navigating to add employee");
    navigate(appRoutes.employees.add);
  };

  return (
    <div className="employees-list-view">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            {/* Header Section */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between border-bottom">
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm btn-${loading ? "outline-primary" : "primary"}`}
                    onClick={handleAddEmployee}
                    disabled={loading}
                    type="button"
                  >
                    {loading ? (
                      <>
                        <Loader />
                        <span className="ms-1">Loading...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-1"></i>
                        Add
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>

              {/* Body Section */}
              <div className="card-body">
                <div className={loading ? "opacity-50 pointer-events-none" : ""}>
                  <EmployeeDataTable
                    employees={employees}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={(id: string) => {
                      const employee = employees.find(emp => emp.id === id);
                      if (employee) {
                        handleDelete(employee);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Confirmation Modal */}
            <AppConfirmationModal
              title={confirmModal.title}
              content={confirmModal.content}
              isOpen={confirmModal.isOpen}
              confirmLabel={confirmModal.confirmLabel}
              cancelLabel={confirmModal.cancelLabel}
              processing={confirmModal.processing}
              confirmButtonColor={confirmModal.confirmButtonColor}
              cancelButtonColor={confirmModal.cancelButtonColor}
              onConfirm={confirmModal.onConfirm}
              onCancel={closeModal}
              confirmProcessingLabel={confirmModal.confirmProcessingLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesListView;
