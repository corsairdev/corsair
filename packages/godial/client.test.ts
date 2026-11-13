import { ApiError } from 'corsair/http';
import { GODIAL_API_BASE, makeGoDialRequest } from './client';

describe('GoDial client', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('uses the documented host and query-token authentication', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{"ok":true}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);

		await makeGoDialRequest('/meta/api/externals/lists/list', {
			method: 'GET',
			apiKey: 'secret token',
		});

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const requestUrl = new URL(String(fetchSpy.mock.calls[0]?.[0]));
		expect(requestUrl.origin).toBe(GODIAL_API_BASE);
		expect(requestUrl.pathname).toBe('/meta/api/externals/lists/list');
		expect(requestUrl.searchParams.get('access_token')).toBe('secret token');
		const headers = new Headers(fetchSpy.mock.calls[0]?.[1]?.headers);
		expect(headers.has('authorization')).toBe(false);
	});

	it('extracts Retry-After without automatically replaying an undocumented request', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{"error":"busy"}', {
				status: 429,
				headers: {
					'content-type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);

		// unknown because the shared transport's rejection value has no static type until narrowed.
		const error = await makeGoDialRequest('/meta/api/externals/lists/list', {
			method: 'GET',
			apiKey: 'secret-token',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) expect(error.retryAfter).toBe(4000);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('redacts the query token from transport errors', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{"error":"denied"}', {
				status: 401,
				headers: { 'content-type': 'application/json' },
			}),
		);

		// unknown because Jest's rejection value has no static type until narrowed.
		const error = await makeGoDialRequest('/meta/api/externals/lists/list', {
			method: 'GET',
			apiKey: 'secret-token',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.url).not.toContain('secret-token');
			expect(error.request.query?.access_token).toBe('[REDACTED]');
		}
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});
