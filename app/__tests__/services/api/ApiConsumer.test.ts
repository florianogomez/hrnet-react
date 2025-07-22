import { isAxiosError } from 'axios';
import { ApiConsumer } from '~/services/api/ApiConsumer';
import ApiHttpMethodEnum from '~/services/api/enums/ApiHttpMethodEnum';

describe('ApiConsumer', () => {
  const mockClient = {
    request: jest.fn(),
  };

  it('construit la config GET avec params', () => {
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET, data: { foo: 'bar' } });
    expect(api.requestDataConfig).toEqual({ params: { foo: 'bar' } });
  });

  it('construit la config POST avec data', () => {
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.POST, data: { foo: 'bar' } });
    expect(api.requestDataConfig).toEqual({ data: { foo: 'bar' } });
  });

  it('construit les headers', () => {
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    expect(api.requestContentTypeConfig).toEqual({ 'Content-Type': 'application/json' });
  });

  it('construit la config Axios complète', () => {
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET, data: { foo: 'bar' } });
    expect(api.getRequestConfig()).toMatchObject({
      url: '/test',
      method: ApiHttpMethodEnum.GET,
      params: { foo: 'bar' },
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('retourne la data si succès', async () => {
    mockClient.request.mockResolvedValueOnce({ data: { message: 'ok', foo: 1 } });
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    const res = await api.request();
    expect(res).toEqual({ message: 'ok', foo: 1 });
  });

  it('retourne une erreur InternalServerApiError si pas de message', async () => {
    mockClient.request.mockResolvedValueOnce({ data: {} });
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    const res = await api.request();
    expect(res.constructor.name).toBe('InternalServerApiError');
  });

  it('retourne une erreur custom si AxiosError', async () => {
    const error = { isAxiosError: true, response: { status: 400, data: { message: 'bad', status: 400 } } };
    mockClient.request.mockRejectedValueOnce(error);
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    const res = await api.request();
    expect(res.constructor.name).toMatch(/ApiError/);
  });

  it('propage les erreurs non Axios', async () => {
    mockClient.request.mockRejectedValueOnce(new Error('fail'));
    const api = new ApiConsumer({ client: mockClient as any, path: '/test', method: ApiHttpMethodEnum.GET });
    await expect(api.request()).rejects.toThrow('fail');
  });
});
