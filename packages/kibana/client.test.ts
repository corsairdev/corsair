import { ApiError, request } from 'corsair/http';
import { KibanaAPIError, makeKibanaRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const BASE = 'https://kibana.example.com:5601';

describe('Kibana API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('throws MISSING_BASE_URL when baseUrl is empty', async () => {
		await expect(makeKibanaRequest('api/status', '', 'some-key')).rejects.toThrow(
			'Base URL is required',
		);
		await expect(makeKibanaRequest('api/status', '', 'some-key')).rejects.toMatchObject({
			code: 'MISSING_BASE_URL',
		});
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('defaults a raw key to ApiKey authorization', async () => {
		await makeKibanaRequest('api/status', BASE, 'raw-key-value');

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config] = mockRequest.mock.calls[0] as [
			{ BASE: string; HEADERS: Record<string, string> },
			unknown,
		];
		expect(config.BASE).toBe(BASE);
		expect(config.HEADERS.Authorization).toBe('ApiKey raw-key-value');
		expect(config.HEADERS['kbn-xsrf']).toBe('true');
	});

	it('does not set TOKEN so the shared layer keeps our auth scheme', async () => {
		await makeKibanaRequest('api/status', BASE, 'raw-key-value');

		const [config] = mockRequest.mock.calls[0] as [
			{ TOKEN?: unknown; HEADERS: Record<string, string> },
			unknown,
		];
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS.Authorization).toBe('ApiKey raw-key-value');
	});

	it('passes through Basic credentials unchanged', async () => {
		await makeKibanaRequest('api/status', BASE, 'Basic dXNlcjpwYXNz');

		const [config] = mockRequest.mock.calls[0] as [
			{ HEADERS: Record<string, string> },
			unknown,
		];
		expect(config.HEADERS.Authorization).toBe('Basic dXNlcjpwYXNz');
	});

	it('passes through ApiKey and Bearer prefixes unchanged', async () => {
		await makeKibanaRequest('api/status', BASE, 'ApiKey abc123');
		expect(
			(mockRequest.mock.calls[0][0] as { HEADERS: Record<string, string> })
				.HEADERS.Authorization,
		).toBe('ApiKey abc123');

		jest.clearAllMocks();
		await makeKibanaRequest('api/status', BASE, 'Bearer xyz');
		expect(
			(mockRequest.mock.calls[0][0] as { HEADERS: Record<string, string> })
				.HEADERS.Authorization,
		).toBe('Bearer xyz');
	});

	it('strips a trailing slash from BASE', async () => {
		await makeKibanaRequest('api/status', `${BASE}/`, 'k');

		const [config] = mockRequest.mock.calls[0] as [
			{ BASE: string },
			unknown,
		];
		expect(config.BASE).toBe(BASE);
	});

	it('forwards query on POST (overwrite must not be dropped)', async () => {
		await makeKibanaRequest('api/saved_objects/dashboard', BASE, 'k', {
			method: 'POST',
			query: { overwrite: true },
			body: { attributes: { title: 'T' } },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				query: { overwrite: true },
				body: { attributes: { title: 'T' } },
			}),
		);
	});

	it('sends body only on POST/PUT/PATCH, never on GET/DELETE', async () => {
		await makeKibanaRequest('api/status', BASE, 'k', {
			method: 'GET',
			body: { attributes: { title: 'T' } },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', body: undefined }),
		);

		jest.clearAllMocks();
		await makeKibanaRequest('api/saved_objects/a/b', BASE, 'k', {
			method: 'PUT',
			body: { attributes: { title: 'T' } },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PUT',
				body: { attributes: { title: 'T' } },
			}),
		);
	});

	it('rethrows ApiError unchanged so 429 retry matching keeps working', async () => {
		const apiErr = new ApiError(
			{ method: 'GET', url: 'api/status' },
			{
				url: 'api/status',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: null,
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValueOnce(apiErr);

		const caught = await makeKibanaRequest('api/status', BASE, 'k').catch(
			(e: unknown) => e,
		);
		expect(caught).toBeInstanceOf(ApiError);
		expect(caught).toBe(apiErr);
		expect(caught).not.toBeInstanceOf(KibanaAPIError);
	});

	it('wraps generic errors in KibanaAPIError', async () => {
		mockRequest.mockRejectedValueOnce(new Error('boom'));

		const caught = await makeKibanaRequest('api/status', BASE, 'k').catch(
			(e: unknown) => e,
		);
		expect(caught).toBeInstanceOf(KibanaAPIError);
		expect((caught as Error).message).toBe('boom');
	});

	it('returns the typed payload on success', async () => {
		mockRequest.mockResolvedValueOnce({ name: 'kibana-node-1' });
		const res = await makeKibanaRequest<{ name: string }>(
			'api/status',
			BASE,
			'k',
		);
		expect(res.name).toBe('kibana-node-1');
	});
});
