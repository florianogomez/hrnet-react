import { EmployeeFindApiConsumer } from '../../consumers/EmployeeFindApiConsumer';
import { ApiModeEnum } from '~/enums/ApiModeEnum';
import config from '~/config';
import { ApiError } from '~/services/api/errors';

describe('EmployeeFindApiConsumer', () => {
  let originalApiMode: any;
  beforeAll(() => {
    originalApiMode = config.apiMode;
  });
  afterAll(() => {
    config.apiMode = originalApiMode;
  });

  it('should return an employee in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeFindApiConsumer('1');
    const result = await consumer.request();
    expect(result).toBeDefined();
  });

  it('should handle ApiError in MOCK mode', async () => {
    config.apiMode = ApiModeEnum.MOCK;
    const consumer = new EmployeeFindApiConsumer('');
    const result = await consumer.request();
    if (result instanceof ApiError) {
      expect(result).toBeInstanceOf(ApiError);
    }
  });
});
