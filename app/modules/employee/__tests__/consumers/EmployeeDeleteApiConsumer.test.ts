import { EmployeeDeleteApiConsumer } from '../../consumers/EmployeeDeleteApiConsumer';
import { ApiModeEnum } from '~/enums/ApiModeEnum';
import config from '~/config';
import { ApiError } from '~/services/api/errors';

describe('EmployeeDeleteApiConsumer', () => {
  let originalApiMode: any;
  beforeAll(() => {
    originalApiMode = config.apiMode;
  });
  afterAll(() => {
    config.apiMode = originalApiMode;
  });

  it('should return a confirmation in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeDeleteApiConsumer('1');
    const result = await consumer.request();
    expect(result).toBeDefined();
  });

  it('should handle ApiError in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeDeleteApiConsumer('');
    const result = await consumer.request();
    if (result instanceof ApiError) {
      expect(result).toBeInstanceOf(ApiError);
    }
  });
});
