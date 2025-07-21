
import { useCallback, useState } from 'react';
import { useAppDispatch } from '~/store/hooks/useAppDispatch';
import { deleteEmployee as deleteEmployeeAction } from "../store/employees_slice";
import { deleteEmployeeAction as deleteEmployeeApiAction } from '../actions';
import type { EmployeeInterface } from '../interfaces';
import { createLogger } from "~/utils/logger";
import { useConfirmModal } from './useConfirmModal';
import type { ConfirmModalState } from './modal.types';

const logger = createLogger("useEmployeeActions");

const initialModalState: ConfirmModalState = {
  isOpen: false,
  title: '',
  content: '',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  confirmButtonColor: 'danger',
  cancelButtonColor: 'secondary',
  onConfirm: () => {},
  onCancel: () => {},
  confirmProcessingLabel: undefined
};

/**
 * Custom React hook providing actions for employee management, such as delete, bulk delete, and export.
 * Also manages the state of the confirmation modal and processing state.
 *
 * @returns An object containing modal state and employee action handlers.
 */
export const useEmployeeActions = () => {
  const dispatch = useAppDispatch();
  const [processing, setProcessing] = useState(false);
  const { modal: confirmModal, open: openModal, close: closeModal, setModal: setConfirmModal } = useConfirmModal(initialModalState);

  // Handler to open the delete confirmation modal for a single employee
  const handleDelete = useCallback((employee: EmployeeInterface) => {
    logger.info("Preparing to delete employee:", { id: employee.id, name: `${employee.firstName} ${employee.lastName}` });
    openModal({
      title: 'Supprimer l\'employé',
      content: `Êtes-vous sûr de vouloir supprimer l'employé "${employee.firstName} ${employee.lastName}" ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
      cancelLabel: 'Annuler',
      confirmButtonColor: 'danger',
      cancelButtonColor: 'secondary',
      confirmProcessingLabel: 'Suppression...',
      onConfirm: async () => {
        setProcessing(true);
        try {
          logger.info("Deleting employee:", { id: employee.id });
          await deleteEmployeeApiAction(employee.id);
          dispatch(deleteEmployeeAction(employee.id));
          logger.info("Employee deleted successfully:", { id: employee.id });
          closeModal();
        } catch (error) {
          logger.error("Failed to delete employee:", { id: employee.id, error });
          closeModal();
        }
      },
      onCancel: closeModal
    });
  }, [dispatch, openModal, closeModal]);

  // Handler to export employees as CSV
  const handleExport = useCallback(async (employees: EmployeeInterface[]) => {
    try {
      logger.info("Exporting employees:", { count: employees.length });
      const headers = ['ID', 'Prénom', 'Nom', 'Date de naissance', 'Date d\'embauche', 'Département', 'Adresse'];
      const csvContent = [
        headers.join(','),
        ...employees.map(emp => [
          emp.id || '',
          `"${emp.firstName}"`,
          `"${emp.lastName}"`,
          emp.dateOfBirth || '',
          emp.startDate || '',
          `"${emp.department}"`,
          `"${emp.street}, ${emp.city}, ${emp.state} ${emp.zipCode}"`
        ].join(','))
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `employees-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      logger.info("Export completed successfully");
    } catch (error) {
      logger.error("Failed to export employees:", { error });
    }
  }, []);

  // Handler to open the bulk delete confirmation modal for multiple employees
  const handleBulkDelete = useCallback((employees: EmployeeInterface[]) => {
    logger.info("Preparing bulk delete:", { count: employees.length });
    openModal({
      title: 'Supprimer les employés sélectionnés',
      content: `Êtes-vous sûr de vouloir supprimer ${employees.length} employé(s) ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer tout',
      cancelLabel: 'Annuler',
      confirmButtonColor: 'danger',
      cancelButtonColor: 'secondary',
      confirmProcessingLabel: 'Suppression...',
      onConfirm: async () => {
        setProcessing(true);
        try {
          logger.info("Executing bulk delete:", { ids: employees.map(e => e.id) });
          await Promise.all(
            employees.map(async (employee) => {
              await deleteEmployeeApiAction(employee.id);
              dispatch(deleteEmployeeAction(employee.id));
            })
          );
          logger.info("Bulk delete completed successfully");
          closeModal();
        } catch (error) {
          logger.error("Failed to bulk delete employees:", { error });
          closeModal();
        }
      },
      onCancel: closeModal
    });
  }, [dispatch, openModal, closeModal]);

  return {
    confirmModal: { ...confirmModal, processing },
    handleDelete,
    handleExport,
    handleBulkDelete,
    closeModal
  };
};
