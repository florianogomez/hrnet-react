import { isAxiosError } from 'axios';
import { ApiConsumer } from '~/services/api/ApiConsumer';
import ApiHttpMethodEnum from '~/services/api/enums/ApiHttpMethodEnum';

describe('ApiConsumer', () => {
  const mockClient = {
    request: jest.fn(),
  };

  it('builds GET config with params', () => {
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET, data: { foo: 'bar' } });
    expect(api.requestDataConfig).toEqual({ params: { foo: 'bar' } });
  });

  it('builds POST config with data', () => {
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.POST, data: { foo: 'bar' } });
    expect(api.requestDataConfig).toEqual({ data: { foo: 'bar' } });
  });

  it('builds the headers', () => {
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    expect(api.requestContentTypeConfig).toEqual({ 'Content-Type': 'application/json' });
  });

  it('builds the complete Axios config', () => {
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET, data: { foo: 'bar' } });
    expect(api.getRequestConfig()).toMatchObject({
      url: '/test',
      method: ApiHttpMethodEnum.GET,
      params: { foo: 'bar' },
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('returns data on success', async () => {
    mockClient.request.mockResolvedValueOnce({ data: { message: 'ok', foo: 1 } });
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    const res = await api.request();
    expect(res).toEqual({ message: 'ok', foo: 1 });
  });

  it('returns an InternalServerApiError if no message', async () => {
    mockClient.request.mockResolvedValueOnce({ data: {} });
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    const res = await api.request();
    expect(res.constructor.name).toBe('InternalServerApiError');
  });

  it('returns a custom error if AxiosError', async () => {
    const error = { isAxiosError: true, response: { status: 400, data: { message: 'bad', status: 400 } } };
    mockClient.request.mockRejectedValueOnce(error);
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    const res = await api.request();
    expect(res.constructor.name).toMatch(/ApiError/);
  });

  it('propagates non-Axios errors', async () => {
    mockClient.request.mockRejectedValueOnce(new Error('fail'));
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    await expect(api.request()).rejects.toThrow('fail');
  });
});
