import BadRequestApiError from '~/services/api/errors/BadRequestApiError';
import { createEmployeeAction } from '../../actions/createEmployeeAction';
import { EmployeeCreateApiConsumer } from '../../consumers/EmployeeCreateApiConsumer';
import { employeeStorageService } from '../../services/EmployeeStorageService';
import { ApiError, GeneralApiError } from '~/services/api/errors';

jest.mock('../../consumers/EmployeeCreateApiConsumer');
jest.mock('../../services/EmployeeStorageService');

const mockEmployee = { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', interface: {} };

describe('createEmployeeAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an employee and store it', async () => {
    (EmployeeCreateApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(mockEmployee),
    }));
    (employeeStorageService.addEmployee as jest.Mock).mockResolvedValue(undefined);

    const result = await createEmployeeAction({ firstName: 'John', lastName: 'Doe' } as any);
    expect(result).toEqual(mockEmployee);
    expect(employeeStorageService.addEmployee).toHaveBeenCalledWith(mockEmployee.interface);
  });

  it('should throw if API returns an error', async () => {
    (EmployeeCreateApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(new BadRequestApiError({
        message: 'fail',
        status: 400,
      })),
    }));
    await expect(createEmployeeAction({ firstName: 'John', lastName: 'Doe' } as any)).rejects.toThrow('Error while creating employee: fail');
  });

  it('should throw if request throws', async () => {
    (EmployeeCreateApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.reject(new Error('network error')),
    }));
    await expect(createEmployeeAction({ firstName: 'John', lastName: 'Doe' } as any)).rejects.toThrow('network error');
  });
});
