import { deleteEmployeeAction } from '../../actions/deleteEmployeeAction';
import { EmployeeDeleteApiConsumer } from '../../consumers/EmployeeDeleteApiConsumer';
import { ApiError } from '~/services/api/errors';

jest.mock('../../consumers/EmployeeDeleteApiConsumer');

const mockResult = { success: true, message: 'Deleted' };

describe('deleteEmployeeAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete an employee and return confirmation', async () => {
    (EmployeeDeleteApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(mockResult),
    }));
    const result = await deleteEmployeeAction('1');
    expect(result).toEqual(mockResult);
  });

  it('should throw if API returns an error', async () => {
    (EmployeeDeleteApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(Object.create(ApiError.prototype)),
    }));
    await expect(deleteEmployeeAction('1')).rejects.toThrow();
  });

  it('should throw if request throws', async () => {
    (EmployeeDeleteApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.reject(new Error('network error')),
    }));
    await expect(deleteEmployeeAction('1')).rejects.toThrow('network error');
  });
});
