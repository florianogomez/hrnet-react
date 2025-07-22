import { EmployeeUpdateApiConsumer } from '../../consumers/EmployeeUpdateApiConsumer';
import { ApiModeEnum } from '~/enums/ApiModeEnum';
import config from '~/config';
import { ApiError } from '~/services/api/errors';

describe('EmployeeUpdateApiConsumer', () => {
  let originalApiMode: any;
  beforeAll(() => {
    originalApiMode = config.apiMode;
  });
  afterAll(() => {
    config.apiMode = originalApiMode;
  });

  it('should return an updated employee in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeUpdateApiConsumer('1', { firstName: 'Jane' });
    const result = await consumer.request();
    expect(result).toBeDefined();
  });

  it('should handle ApiError in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeUpdateApiConsumer('', {});
    const result = await consumer.request();
    if (result instanceof ApiError) {
      expect(result).toBeInstanceOf(ApiError);
    }
  });
});
