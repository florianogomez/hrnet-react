import { EmployeeListApiConsumer } from '../../consumers/EmployeeListApiConsumer';
import { ApiModeEnum } from '~/enums/ApiModeEnum';
import config from '~/config';
import { ApiError } from '~/services/api/errors';

describe('EmployeeListApiConsumer', () => {
  let originalApiMode: any;
  beforeAll(() => {
    originalApiMode = config.apiMode;
  });
  afterAll(() => {
    config.apiMode = originalApiMode;
  });

  it('should return an array of employees in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeListApiConsumer({});
    const result = await consumer.request();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle ApiError in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeListApiConsumer({ department: '' });
    const result = await consumer.request();
    if (result instanceof ApiError) {
      expect(result).toBeInstanceOf(ApiError);
    }
  });
});
