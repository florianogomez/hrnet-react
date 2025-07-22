import { updateEmployeeAction } from '../../actions/updateEmployeeAction';
import { EmployeeUpdateApiConsumer } from '../../consumers/EmployeeUpdateApiConsumer';
import { employeeStorageService } from '../../services';
import { ApiError } from '~/services/api/errors';

jest.mock('../../consumers/EmployeeUpdateApiConsumer');
jest.mock('../../services');

const mockEmployee = { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', interface: {} };

describe('updateEmployeeAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update an employee and store it', async () => {
    (EmployeeUpdateApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(mockEmployee),
    }));
    (employeeStorageService.updateEmployee as jest.Mock).mockResolvedValue(undefined);

    const result = await updateEmployeeAction('1', { firstName: 'John' });
    expect(result).toEqual(mockEmployee);
    expect(employeeStorageService.updateEmployee).toHaveBeenCalledWith(mockEmployee.interface);
  });

  it('should throw if API returns an error', async () => {
    (EmployeeUpdateApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(Object.create(ApiError.prototype)),
    }));
    await expect(updateEmployeeAction('1', { firstName: 'John' })).rejects.toThrow();
  });

  it('should throw if request throws', async () => {
    (EmployeeUpdateApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.reject(new Error('network error')),
    }));
    await expect(updateEmployeeAction('1', { firstName: 'John' })).rejects.toThrow('network error');
  });
});
