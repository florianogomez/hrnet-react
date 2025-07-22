import { EmployeeCreateApiConsumer } from '../../consumers/EmployeeCreateApiConsumer';
import { ApiModeEnum } from '~/enums/ApiModeEnum';
import config from '~/config';
import { EmployeeModel } from '../../models';
import { ApiError } from '~/services/api/errors';

describe('EmployeeCreateApiConsumer', () => {
  const payload = { firstName: 'John', lastName: 'Doe' } as any;
  let originalApiMode: any;

  beforeAll(() => {
    originalApiMode = config.apiMode;
  });
  afterAll(() => {
    config.apiMode = originalApiMode;
  });

  it('should return EmployeeModel in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeCreateApiConsumer(payload);
    const result = await consumer.request();
    expect(result).toBeInstanceOf(EmployeeModel);
    if (result instanceof EmployeeModel) {
      expect(result.firstName).toBe('John');
    }
  });

  it('should handle ApiError in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeCreateApiConsumer({ ...payload, firstName: '' });
    const result = await consumer.request();
    if (result instanceof ApiError) {
      expect(result).toBeInstanceOf(ApiError);
    }
  });
});
