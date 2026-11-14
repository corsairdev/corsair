import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { IMGIX_API_BASE, ImgixAPIError, makeImgixRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: 'sources' },
		{
			url: 'https://api.imgix.com/api/v1/sources',
			ok: false,
			status,
			statusText: message,
			body: { message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeImgixRequest', () => {
	it('uses the v1 base URL and Authorization: Bearer <key>', async () => {
		mockedRequest.mockResolvedValue({ data: [] });

		await makeImgixRequest('fixture-key', {
			method: 'GET',
			path: 'sources',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: IMGIX_API_BASE,
			VERSION: '1.0.0',
			HEADERS: expect.objectContaining({
				Authorization: 'Bearer fixture-key',
				Accept: 'application/vnd.api+json, application/json',
			}),
		});
		// Content-Type is left to core, which sets it only when a body is sent
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Content-Type',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: 'sources',
			}),
		);
	});

	it('omits Authorization header when apiKey is undefined', async () => {
		mockedRequest.mockResolvedValue({ data: [] });

		await makeImgixRequest(undefined, {
			method: 'GET',
			path: 'sources',
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('throws AuthMissingError when apiKey is explicitly empty without sending request', async () => {
		await expect(
			makeImgixRequest('', { method: 'GET', path: 'sources' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('passes custom query, Blob body, and its content type correctly', async () => {
		mockedRequest.mockResolvedValue({ data: {} });
		const buffer = new Blob([Buffer.from('test-image-binary')], {
			type: 'image/png',
		});

		await makeImgixRequest('fixture-key', {
			method: 'POST',
			path: 'sources/src_123/upload/image.png',
			query: { overwrite: true },
			body: buffer,
			headers: { 'Content-Type': 'image/png' },
		});

		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: 'sources/src_123/upload/image.png',
				body: buffer,
				mediaType: 'image/png',
				query: { overwrite: true },
			}),
		);
	});

	it('preserves 429 status and retryAfter on rate limit error', async () => {
		const error = makeApiError(429, 'Too Many Requests', 2500);
		mockedRequest.mockRejectedValue(error);

		// `unknown` because the thrown error type is untrusted until narrowed
		const caught: unknown = await makeImgixRequest('fixture-key', {
			method: 'GET',
			path: 'sources',
		}).catch((e: unknown) => e);

		expect(caught).toBe(error);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('drops the request body (credentials, customer data) from a propagated ApiError', async () => {
		const requestBody = {
			name: 'My S3 Source',
			deployment: {
				type: 's3',
				s3_bucket: 'my-bucket',
				s3_access_key: 'AKIAEXAMPLEKEY',
				s3_secret_key: 'top-secret-s3-key',
				gcs_client_email: 'imgix-service@example.com',
				gcs_private_key: 'gcs-private-key-data',
				secure_url_token: 'secure-url-token-value',
				azure_access_key: 'azure-key-123',
				private_key: 'rsa-private-key-data',
				token: 'secret-token-val',
			},
			custom_fields: { contact_email: 'customer@example.com' },
		};

		const error = new ApiError(
			{ method: 'POST', url: 'sources', body: requestBody },
			{
				url: 'https://api.imgix.com/api/v1/sources',
				ok: false,
				status: 422,
				statusText: 'Unprocessable Entity',
				body: { errors: [{ title: 'Invalid deployment' }] },
			},
			'Unprocessable Entity',
			{
				retryAfter: 1200,
				rateLimitReset: 1_700_000_000,
				rateLimitRemaining: 5,
				rateLimitLimit: 100,
			},
		);
		mockedRequest.mockRejectedValue(error);

		// `unknown` because a rejected value is only narrowed by assertions below
		let propagated: unknown;
		try {
			await makeImgixRequest('fixture-key', {
				method: 'POST',
				path: 'sources',
				body: requestBody,
			});
		} catch (err: unknown) {
			propagated = err;
		}

		expect(propagated).toBeInstanceOf(ApiError);
		if (propagated instanceof ApiError) {
			expect(propagated.status).toBe(422);
			expect(propagated.retryAfter).toBe(1200);
			expect(propagated.rateLimitRemaining).toBe(5);
			expect(propagated.request.body).toBeUndefined();
			expect(JSON.stringify(propagated)).not.toContain('customer@example.com');
			expect(JSON.stringify(propagated)).not.toContain('top-secret-s3-key');
		}
	});

	it('rethrows generic Error instances unchanged', async () => {
		const error = new Error('Network timeout');
		mockedRequest.mockRejectedValue(error);

		await expect(
			makeImgixRequest('fixture-key', { method: 'GET', path: 'sources' }),
		).rejects.toBe(error);
	});

	it('wraps non-Error rejections in ImgixAPIError', async () => {
		mockedRequest.mockRejectedValue('unexpected string rejection');

		await expect(
			makeImgixRequest('fixture-key', { method: 'GET', path: 'sources' }),
		).rejects.toThrow(ImgixAPIError);
	});

	it('uses real transport to parse 429 Retry-After correctly', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');

		const mockResponse = {
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: {
				get: (name: string) => {
					if (name.toLowerCase() === 'retry-after') return '4';
					return null;
				},
			},
			json: async () => ({ error: 'rate limited' }),
			text: async () => JSON.stringify({ error: 'rate limited' }),
			clone: function () {
				return this;
			},
		};

		const originalFetch = global.fetch;
		global.fetch = jest.fn().mockResolvedValue(mockResponse);

		try {
			// `unknown` because the rejection reason has no static type until narrowed
			const err: unknown = await actualHttp
				.request(
					{
						BASE: IMGIX_API_BASE,
						VERSION: '1.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
						HEADERS: { 'Content-Type': 'application/json' },
					},
					{
						method: 'GET',
						url: 'sources',
					},
					{
						rateLimitConfig: {
							enabled: true,
							maxRetries: 0,
							initialRetryDelay: 0,
							backoffMultiplier: 1,
							headerNames: { retryAfter: 'retry-after' },
						},
					},
				)
				.catch((e: unknown) => e);

			expect(err).toBeInstanceOf(ApiError);
			if (err instanceof ApiError) {
				expect(err.status).toBe(429);
				expect(err.retryAfter).toBe(4000);
			}
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('uses real transport to send Blob bytes and parse JSON:API responses', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		mockedRequest.mockImplementation(actualHttp.request);

		const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff]);
		const responseBody = {
			data: { id: 'src_123', type: 'sources', attributes: { name: 'Images' } },
		};
		const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(JSON.stringify(responseBody), {
				status: 200,
				headers: { 'Content-Type': 'application/vnd.api+json' },
			}),
		);

		try {
			const response = await makeImgixRequest('fixture-key', {
				method: 'POST',
				path: 'sources/src_123/upload/image.png',
				body: new Blob([bytes], { type: 'application/octet-stream' }),
				headers: { 'Content-Type': 'application/octet-stream' },
			});

			expect(response).toEqual(responseBody);
			expect(fetchSpy).toHaveBeenCalledTimes(1);
			const sentBody = fetchSpy.mock.calls[0]?.[1]?.body;
			expect(sentBody).toBeInstanceOf(Blob);
			if (sentBody instanceof Blob) {
				expect(new Uint8Array(await sentBody.arrayBuffer())).toEqual(bytes);
			}
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('sends no Content-Type on a bodyless POST (imgix rejects it as unparseable JSON)', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		mockedRequest.mockImplementation(actualHttp.request);
		const fetchSpy = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response(null, { status: 202 }));

		try {
			await makeImgixRequest('fixture-key', {
				method: 'POST',
				path: 'sources/src_123/upload-sessions/a.png',
			});
			const sentHeaders = fetchSpy.mock.calls[0]?.[1]?.headers;
			expect(sentHeaders).toBeInstanceOf(Headers);
			if (sentHeaders instanceof Headers) {
				expect(sentHeaders.get('Content-Type')).toBeNull();
			}
			expect(fetchSpy.mock.calls[0]?.[1]?.body).toBeUndefined();
		} finally {
			fetchSpy.mockRestore();
		}
	});
});
