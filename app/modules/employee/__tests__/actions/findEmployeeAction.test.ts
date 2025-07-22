import { findEmployeeAction } from '../../actions/findEmployeeAction';
import { EmployeeFindApiConsumer } from '../../consumers/EmployeeFindApiConsumer';
import { ApiError } from '~/services/api/errors';

jest.mock('../../consumers/EmployeeFindApiConsumer');

const mockEmployee = { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe' };

describe('findEmployeeAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the found employee', async () => {
    (EmployeeFindApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(mockEmployee),
    }));
    const result = await findEmployeeAction('1');
    expect(result).toEqual(mockEmployee);
  });

  it('should throw if API returns an error', async () => {
    (EmployeeFindApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(Object.create(ApiError.prototype)),
    }));
    await expect(findEmployeeAction('1')).rejects.toThrow();
  });

  it('should throw if request throws', async () => {
    (EmployeeFindApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.reject(new Error('network error')),
    }));
    await expect(findEmployeeAction('1')).rejects.toThrow('network error');
  });
});
