import { AuthMissingError } from 'corsair/core';
import {
	FORMDESK_API_HOST,
	FormdeskAPIError,
	makeFormdeskRequest,
} from './client';

const originalFetch = global.fetch;
const mockFetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>();

beforeEach(() => {
	mockFetch.mockReset();
	global.fetch = mockFetch;
});

afterAll(() => {
	global.fetch = originalFetch;
});

describe('Formdesk REST client', () => {
	it('uses tenant host, account path, bearer auth, query, and JSON body', async () => {
		mockFetch.mockResolvedValue(
			new Response(
				JSON.stringify({ ticket: 'ticket', expires: '2030-01-01' }),
				{
					status: 200,
					headers: { credits: '47', 'content-type': 'application/json' },
				},
			),
		);

		const result = await makeFormdeskRequest('fd7.formdesk.com', {
			method: 'POST',
			path: '/park',
			domain: 'tenant',
			apiKey: 'secret-key',
			query: { reuse: true, absent: undefined },
			body: { data: { name: 'Ada' }, expires: 3600 },
		});

		const [requestUrl, requestInit] = mockFetch.mock.calls[0] ?? [];
		expect(String(requestUrl)).toBe(
			'https://fd7.formdesk.com/api/rest/v1/tenant/park?reuse=true',
		);
		expect(new Headers(requestInit?.headers).get('authorization')).toBe(
			'Bearer secret-key',
		);
		expect(requestInit?.method).toBe('POST');
		expect(requestInit?.body).toBe(
			JSON.stringify({ data: { name: 'Ada' }, expires: 3600 }),
		);
		expect(result).toEqual({
			payload: { ticket: 'ticket', expires: '2030-01-01' },
			creditsRemaining: 47,
		});
	});

	it('uses www.formdesk.com and sends no authorization for credential Connect', async () => {
		mockFetch.mockResolvedValue(
			new Response(
				JSON.stringify({ apikey: 'new-key', host: 'fd7.formdesk.com' }),
				{
					status: 200,
					headers: { 'content-type': 'application/json' },
				},
			),
		);

		await makeFormdeskRequest(FORMDESK_API_HOST, {
			method: 'POST',
			path: '/connect',
			body: { domain: 'tenant', username: 'operator', password: 'secret' },
		});

		const [requestUrl, requestInit] = mockFetch.mock.calls[0] ?? [];
		expect(String(requestUrl)).toBe(
			'https://www.formdesk.com/api/rest/v1/connect',
		);
		expect(new Headers(requestInit?.headers).has('authorization')).toBe(false);
	});

	it('rejects an empty key before network I/O', async () => {
		await expect(
			makeFormdeskRequest('fd7.formdesk.com', {
				method: 'GET',
				path: '/forms',
				domain: 'tenant',
				apiKey: '',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('preserves 429 Retry-After milliseconds for the endpoint error handler', async () => {
		mockFetch.mockResolvedValue(
			new Response('{}', {
				status: 429,
				headers: { 'retry-after': '3' },
			}),
		);

		// `unknown` because a rejected promise may carry any value; the assertion
		// below narrows it to FormdeskAPIError before its retry metadata is read.
		const error = await makeFormdeskRequest('fd7.formdesk.com', {
			method: 'GET',
			path: '/forms',
			domain: 'tenant',
			apiKey: 'secret-key',
			retryable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(FormdeskAPIError);
		if (!(error instanceof FormdeskAPIError))
			throw new Error('Expected FormdeskAPIError');
		expect(error.status).toBe(429);
		expect(error.retryAfterMs).toBe(3000);
		expect(error.retryable).toBe(true);
	});

	it('maps abort timeouts to a sanitized TIMEOUT error', async () => {
		mockFetch.mockRejectedValue(
			new DOMException('Sensitive transport detail', 'TimeoutError'),
		);
		// `unknown` because a rejected promise may carry any value; the assertion
		// below narrows the error before its stable code and message are checked.
		const error = await makeFormdeskRequest('fd7.formdesk.com', {
			method: 'GET',
			path: '/forms',
			domain: 'tenant',
			apiKey: 'secret-key',
			retryable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(FormdeskAPIError);
		if (!(error instanceof FormdeskAPIError))
			throw new Error('Expected FormdeskAPIError');
		expect(error.code).toBe('TIMEOUT');
		expect(error.message).toBe('Formdesk request timed out');
	});

	it.each([
		{
			name: 'timeout',
			failure: new DOMException('Sensitive body-read detail', 'TimeoutError'),
			code: 'TIMEOUT',
			message: 'Formdesk request timed out',
		},
		{
			name: 'network failure',
			failure: new TypeError('Sensitive socket detail'),
			code: 'NETWORK_ERROR',
			message: 'Formdesk request failed before a response was received',
		},
	])(
		'sanitizes JSON body-read $name after headers arrive',
		async ({ failure, code, message }) => {
			const response = new Response(null, { status: 200 });
			jest.spyOn(response, 'json').mockRejectedValue(failure);
			mockFetch.mockResolvedValue(response);

			await expect(
				makeFormdeskRequest('fd7.formdesk.com', {
					method: 'GET',
					path: '/forms',
					domain: 'tenant',
					apiKey: 'secret-key',
					retryable: true,
				}),
			).rejects.toMatchObject({
				name: 'FormdeskAPIError',
				code,
				retryable: true,
				message,
			});
			expect(response.json).toHaveBeenCalledTimes(1);
		},
	);

	it('sanitizes HTTP failures rather than propagating provider response data', async () => {
		mockFetch.mockResolvedValue(
			new Response('{"reason":"sensitive submitted data"}', {
				status: 401,
				statusText: 'Unauthorized',
			}),
		);

		await expect(
			makeFormdeskRequest('fd7.formdesk.com', {
				method: 'POST',
				path: '/users',
				domain: 'tenant',
				apiKey: 'secret-key',
			}),
		).rejects.toMatchObject({
			status: 401,
			message: 'Formdesk request failed with HTTP 401',
		});
	});

	it('returns binary content as bounded base64 with its filename', async () => {
		const bytes = Buffer.from([0, 1, 2, 255]);
		mockFetch.mockResolvedValue(
			new Response(bytes, {
				status: 200,
				headers: {
					'content-type': 'image/png',
					'content-disposition': 'attachment; filename="photo.png"',
				},
			}),
		);

		const result = await makeFormdeskRequest('fd7.formdesk.com', {
			method: 'GET',
			path: '/files/22/content',
			domain: 'tenant',
			apiKey: 'secret-key',
			binary: true,
		});

		expect(result.payload).toEqual({
			kind: 'binary',
			contentType: 'image/png',
			base64: bytes.toString('base64'),
			filename: 'photo.png',
			byteLength: 4,
		});
	});

	it('rejects binary responses larger than the local safety cap', async () => {
		mockFetch.mockResolvedValue(
			new Response(new Uint8Array(), {
				status: 200,
				headers: { 'content-length': String(25 * 1024 * 1024 + 1) },
			}),
		);

		await expect(
			makeFormdeskRequest('fd7.formdesk.com', {
				method: 'GET',
				path: '/files/22/content',
				domain: 'tenant',
				apiKey: 'secret-key',
				binary: true,
			}),
		).rejects.toThrow('exceeds 25 MiB');
	});

	it('returns null for documented 204 responses', async () => {
		mockFetch.mockResolvedValue(new Response(null, { status: 204 }));
		await expect(
			makeFormdeskRequest('fd7.formdesk.com', {
				method: 'DELETE',
				path: '/files/22',
				domain: 'tenant',
				apiKey: 'secret-key',
			}),
		).resolves.toMatchObject({ payload: null });
	});
});
