import { EmployeeStorageService } from '../../services/EmployeeStorageService';
import { EmployeeModel } from '../../models';
import { setEmployees, setEmployeesLoading, setEmployeeError } from '../../store/employees_slice';
import { store } from '~/store';

jest.mock('~/store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({ employee: { employees: [], processing: false, error: null } }))
  }
}));

jest.mock('../../store/employees_slice', () => ({
  setEmployees: jest.fn((payload) => ({ type: 'setEmployees', payload })),
  setEmployeesLoading: jest.fn((payload) => ({ type: 'setEmployeesLoading', payload })),
  setEmployeeError: jest.fn((payload) => ({ type: 'setEmployeeError', payload })),
}));

describe('EmployeeStorageService', () => {
  let service: EmployeeStorageService;
  beforeEach(() => {
    service = new EmployeeStorageService();
    jest.clearAllMocks();
  });


  it('should sync employees to Redux', () => {
    const employees = [
      new EmployeeModel({
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
      })
    ];
    service['employeesReduxSync'].action(employees);
    expect(setEmployees).toHaveBeenCalledWith(employees);
  });

  it('should sync loading to Redux', () => {
    service['loadingReduxSync'].action(true);
    expect(setEmployeesLoading).toHaveBeenCalledWith(true);
  });

  it('should sync error to Redux', () => {
    service['errorReduxSync'].action('error');
    expect(setEmployeeError).toHaveBeenCalledWith('error');
  });

  describe('Persistence methods', () => {
    let addSpy: jest.SpyInstance;
    let updateSpy: jest.SpyInstance;
    let deleteSpy: jest.SpyInstance;
    let getSpy: jest.SpyInstance;
    beforeEach(() => {
      addSpy = jest.spyOn(EmployeeStorageService.prototype, 'addEmployee').mockResolvedValue(undefined);
      updateSpy = jest.spyOn(EmployeeStorageService.prototype, 'updateEmployee').mockResolvedValue(undefined);
      deleteSpy = jest.spyOn(EmployeeStorageService.prototype, 'deleteEmployee').mockResolvedValue(undefined);
      getSpy = jest.spyOn(EmployeeStorageService.prototype, 'getEmployees').mockResolvedValue([]);
    });
    afterEach(() => {
      addSpy.mockRestore();
      updateSpy.mockRestore();
      deleteSpy.mockRestore();
      getSpy.mockRestore();
    });

    it('should add an employee', async () => {
      const employee = new EmployeeModel({
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
      });
      await expect(service.addEmployee(employee)).resolves.toBeUndefined();
      expect(addSpy).toHaveBeenCalledWith(employee);
    });

    it('should update an employee', async () => {
      const employee = new EmployeeModel({
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
      });
      await expect(service.updateEmployee(employee)).resolves.toBeUndefined();
      expect(updateSpy).toHaveBeenCalledWith(employee);
    });

    it('should delete an employee', async () => {
      await expect(service.deleteEmployee('2')).resolves.toBeUndefined();
      expect(deleteSpy).toHaveBeenCalledWith('2');
    });

    it('should get all employees', async () => {
      await expect(service.getEmployees()).resolves.toEqual([]);
      expect(getSpy).toHaveBeenCalled();
    });
  });
});
