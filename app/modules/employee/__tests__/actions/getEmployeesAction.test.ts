import { getEmployeesAction } from '../../actions/getEmployeesAction';
import { EmployeeListApiConsumer } from '../../consumers/EmployeeListApiConsumer';
import { ApiError } from '~/services/api/errors';

jest.mock('../../consumers/EmployeeListApiConsumer');

const mockEmployees = [
  { id: '1', firstName: 'John', lastName: 'Doe' },
  { id: '2', firstName: 'Jane', lastName: 'Smith' },
];

describe('getEmployeesAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return employees list', async () => {
    (EmployeeListApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(mockEmployees),
    }));
    const result = await getEmployeesAction();
    expect(result).toEqual(mockEmployees);
  });

  it('should throw if API returns an error', async () => {
    (EmployeeListApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.resolve(Object.create(ApiError.prototype)),
    }));
    await expect(getEmployeesAction()).rejects.toThrow();
  });

  it('should throw if request throws', async () => {
    (EmployeeListApiConsumer as any).mockImplementation(() => ({
      request: () => Promise.reject(new Error('network error')),
    }));
    await expect(getEmployeesAction()).rejects.toThrow('network error');
  });
});
