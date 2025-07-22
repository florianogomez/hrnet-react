import React, { useRef, useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import type { EmployeeInterface } from '../interfaces/EmployeeInterface';

/**
 * Props for the EmployeeDataTable component.
 * @interface EmployeeDataTableProps
 * @property {EmployeeInterface[]} employees - The list of employees to display.
 * @property {boolean} [loading] - Whether the table is loading data.
 * @property {(id: string) => void} [onDelete] - Callback for deleting an employee by id.
 * @property {(id: string) => void} [onEdit] - Callback for editing an employee by id.
 */

// Configuration de DataTables avec Bootstrap 5
DataTable.use(DT);

interface EmployeeDataTableProps {
  employees: EmployeeInterface[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

/**
 * EmployeeDataTable component displays a list of employees in a DataTable with actions.
 * Handles edit and delete actions, loading state, and export.
 * @param {EmployeeDataTableProps} props - The component props.
 * @returns {JSX.Element} The rendered employee data table.
 */
export const EmployeeDataTable: React.FC<EmployeeDataTableProps> = ({
  employees = [],
  loading = true,
  onEdit,
  onDelete,
}) => {
  /**
   * Ref for the DataTable instance.
   */
  const tableRef = useRef<any>(null);
  /**
   * Key to force remount of DataTable when employees change.
   */
  const [tableKey, setTableKey] = useState(0);

  /**
   * Format a date string to locale date (fr-FR).
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date or '-' if empty.
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  /**
   * Get the full name of an employee.
   * @param {EmployeeInterface} employee - The employee object.
   * @returns {string} The full name.
   */
  const getFullName = (employee: EmployeeInterface) => {
    return `${employee.firstName} ${employee.lastName}`.trim();
  };

  /**
   * Get the full address of an employee.
   * @param {EmployeeInterface} employee - The employee object.
   * @returns {string} The full address.
   */
  const getFullAddress = (employee: EmployeeInterface) => {
    return `${employee.street}, ${employee.city}, ${employee.state} ${employee.zipCode}`.trim();
  };

  /**
   * DataTable columns configuration.
   */
  const columns = [
    {
      title: 'Name',
      data: null,
      render: (data: any, type: string, row: EmployeeInterface) => {
        if (type === 'display' || type === 'type') {
          return `
            <div class="d-flex align-items-center">
              <div>
                <div class="fw-bold">${getFullName(row)}</div>
                <small class="text-muted">ID: ${row.id}</small>
              </div>
            </div>
          `;
        }
        return getFullName(row);
      }
    },
    {
      title: 'Date of birth',
      data: 'dateOfBirth',
      render: (data: string) => formatDate(data)
    },
    {
      title: 'Department',
      data: 'department',
      render: (data: string) => `<span class="badge bg-primary">${data}</span>`
    },
    {
      title: 'Start date',
      data: 'startDate',
      render: (data: string) => formatDate(data)
    },
    {
      title: 'Address',
      data: null,
      render: (data: any, type: string, row: EmployeeInterface) => {
        if (type === 'display' || type === 'type') {
          return `
            <div>
              <div>${row.street}</div>
              <small class="text-muted">${row.city}, ${row.state} ${row.zipCode}</small>
            </div>
          `;
        }
        return getFullAddress(row);
      }
    },
    {
      title: 'Actions',
      data: null,
      orderable: false,
      searchable: false,
      width: '120px',
      render: (data: any, type: string, row: EmployeeInterface) => {
        const editBtn = onEdit ? `
          <button 
            class="btn btn-outline-primary btn-sm me-1 action-edit" 
            data-id="${row.id}"
            title="Edit"
          >
            <i class="bi bi-pencil"></i>
          </button>
        ` : '';
        
        const deleteBtn = onDelete ? `
          <button 
            class="btn btn-outline-danger btn-sm action-delete" 
            data-id="${row.id}"
            title="Delete"
          >
            <i class="bi bi-trash"></i>
          </button>
        ` : '';
        
        return `<div class="d-flex gap-1">${editBtn}${deleteBtn}</div>`;
      }
    }
  ];

  /**
   * DataTable options configuration.
   */
  const dtOptions = {
    columns: columns,
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50, 100],
    responsive: true,
    destroy: true, // Important: détruit et recrée le tableau à chaque changement
    language: {
      decimal: '.',
      thousands: ',',
      lengthMenu: 'Show _MENU_ entries',
      loadingRecords: 'Loading...',
      processing: 'Processing...',
      search: 'Search:',
      zeroRecords: 'No data available in table',
      paginate: {
        first: 'First',
        last: 'Last',
        next: 'Next',
        previous: 'Previous'
      },
      info: 'Showing _START_ to _END_ of _TOTAL_ entries',
      infoEmpty: 'Showing 0 to 0 of 0 entries',
      infoFiltered: '(filtered from _MAX_ total entries)'
    },
    order: [[0, 'asc']] as any, // Tri par nom par défaut
    processing: loading,
    deferRender: true,
    stateSave: false,
    search: {
      caseInsensitive: true
    }
  } as any;


  /**
   * Effect to handle click events on edit/delete action buttons.
   */
  useEffect(() => {
    const handleActionClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('button');
      
      if (!button) return;

      const employeeId = button.getAttribute('data-id');
      if (!employeeId) return;

      if (button.classList.contains('action-edit') && onEdit) {
        event.preventDefault();
        event.stopPropagation();
        onEdit(employeeId);
      } else if (button.classList.contains('action-delete') && onDelete) {
        event.preventDefault();
        event.stopPropagation();
        onDelete(employeeId);
      }
    };

    // Listen on the document to capture all clicks
    document.addEventListener('click', handleActionClick);

    return () => {
      document.removeEventListener('click', handleActionClick);
    };
  }, [onEdit, onDelete]);


  /**
   * Effect to force remount of DataTable when employees change.
   */
  useEffect(() => {
    setTableKey(prev => prev + 1);
  }, [employees.length]);



  // Show loading spinner if loading and no employees
  if (loading && employees.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="d-flex align-items-center justify-content-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading employees...
        </div>
      </div>
    );
  }

  // Show empty state if not loading and no employees
  if (!loading && employees.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <div className="fs-1 mb-2">👥</div>
        <h5>No employees found</h5>
        <p>Start by adding your first employee.</p>
      </div>
    );
  }


  return (
    <div className="employee-datatable">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Employee List ({employees.length})</h5>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              /**
               * Export employees as JSON file.
               */
              const dataStr = JSON.stringify(employees, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'employees.json';
              link.click();
              URL.revokeObjectURL(url);
            }}
            title="Export as JSON"
          >
            <i className="bi bi-download me-1"></i>
            Export
          </button>
        </div>
      </div>
      
      <DataTable
        key={tableKey}
        ref={tableRef}
        data={employees}
        options={dtOptions}
        className="table table-striped table-hover"
      />
    </div>
  );
};

export default EmployeeDataTable;