import employeesSlice, {
  setEmployeesLoading,
  setEmployees,
  addEmployee,
  setEmployeeJustAdded,
  setEmployeeError,
  deleteEmployee
} from '../../store/employees_slice';
import type { EmployeesState } from '../../store/employees_slice';
import type { EmployeeInterface } from '../../interfaces/EmployeeInterface';

describe('employees_slice reducers', () => {
  const initialState: EmployeesState = {
    employees: [],
    processing: false,
    justAdded: null,
    error: null,
  };

  it('should handle setEmployeesLoading', () => {
    const next = employeesSlice(initialState, setEmployeesLoading(true));
    expect(next.processing).toBe(true);
  });

  it('should handle setEmployees', () => {
    const employees: EmployeeInterface[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        startDate: '2020-01-01',
        department: 'Sales',
        street: '123 Main St',
        city: 'Paris',
        state: 'FR',
        zipCode: '75000',
      }
    ];
    const next = employeesSlice(initialState, setEmployees(employees));
    expect(next.employees).toEqual(employees);
  });

  it('should handle addEmployee', () => {
    const employee: EmployeeInterface = {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1992-02-02',
      startDate: '2021-02-02',
      department: 'HR',
      street: '456 Main St',
      city: 'Lyon',
      state: 'FR',
      zipCode: '69000',
    };
    const next = employeesSlice(initialState, addEmployee(employee));
    expect(next.employees).toContainEqual(employee);
  });

  it('should handle setEmployeeJustAdded', () => {
    const employee: EmployeeInterface = {
      id: '3',
      firstName: 'Alice',
      lastName: 'Wonder',
      dateOfBirth: '1995-03-03',
      startDate: '2022-03-03',
      department: 'Engineering',
      street: '789 Main St',
      city: 'Nice',
      state: 'FR',
      zipCode: '06000',
    };
    const next = employeesSlice(initialState, setEmployeeJustAdded(employee));
    expect(next.justAdded).toEqual(employee);
  });

  it('should handle setEmployeeError', () => {
    const next = employeesSlice(initialState, setEmployeeError('error!'));
    expect(next.error).toBe('error!');
  });

  it('should handle deleteEmployee', () => {
    const state: EmployeesState = {
      ...initialState,
      employees: [
        { id: '1', firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', startDate: '2020-01-01', department: 'Sales', street: '123 Main St', city: 'Paris', state: 'FR', zipCode: '75000' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1992-02-02', startDate: '2021-02-02', department: 'HR', street: '456 Main St', city: 'Lyon', state: 'FR', zipCode: '69000' }
      ]
    };
    const next = employeesSlice(state, deleteEmployee('1'));
    expect(next.employees).toHaveLength(1);
    expect(next.employees[0].id).toBe('2');
  });
});
