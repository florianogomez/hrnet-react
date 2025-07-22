
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '~/store';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useEmployeeList: jest.fn(() => ({ loading: false, employees: [{ id: 1, name: 'John' }], loadEmployees: jest.fn() })),
  useEmployeeActions: jest.fn(() => ({
    handleDelete: jest.fn(),
    handleBulkDelete: jest.fn(),
    handleExport: jest.fn(),
    confirmModal: { isOpen: false },
    closeModal: jest.fn(),
  }))
}));

import EmployeesListView from '../../views/EmployeesListView';

describe('EmployeesListView', () => {
  it('doit afficher la liste des employés', () => {
    require('../../hooks').useEmployeeList.mockReturnValue({ loading: false, employees: [{ id: 1, name: 'John' }], loadEmployees: jest.fn() });
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <EmployeesListView />
        </MemoryRouter>
      </Provider>
    );
    expect(container.innerHTML).toMatch(/employé|employee|liste/i);
  });

  it('affiche le loader quand loading est true', () => {
    require('../../hooks').useEmployeeList.mockReturnValue({ loading: true, employees: [], loadEmployees: jest.fn() });
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <EmployeesListView />
        </MemoryRouter>
      </Provider>
    );
    expect(container.innerHTML).toMatch(/loading/i);
  });

  it('affiche le message "No employees found" si la liste est vide', () => {
    require('../../hooks').useEmployeeList.mockReturnValue({ loading: false, employees: [], loadEmployees: jest.fn() });
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <EmployeesListView />
        </MemoryRouter>
      </Provider>
    );
    expect(container.innerHTML).toMatch(/no employees found/i);
  });

  it('affiche le bouton d\'ajout', () => {
    require('../../hooks').useEmployeeList.mockReturnValue({ loading: false, employees: [{ id: 1, name: 'John' }], loadEmployees: jest.fn() });
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <EmployeesListView />
        </MemoryRouter>
      </Provider>
    );
    expect(container.innerHTML).toMatch(/ajouter|add/i);
  });

  it('affiche le bouton d\'export', () => {
    require('../../hooks').useEmployeeList.mockReturnValue({ loading: false, employees: [{ id: 1, name: 'John' }], loadEmployees: jest.fn() });
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <EmployeesListView />
        </MemoryRouter>
      </Provider>
    );
    expect(container.innerHTML).toMatch(/export/i);
  });
});
