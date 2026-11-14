import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	CLOUDLAYER_API_BASE,
	CLOUDLAYER_API_KEY_HEADER,
	CLOUDLAYER_API_V1_BASE,
	CLOUDLAYER_SYNC_TIMEOUT_MS,
	makeCloudlayerRequest,
	makeCloudlayerSyncRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/jobs' },
		{
			url: 'https://api.cloudlayer.io/v2/jobs',
			ok: false,
			status,
			statusText: message,
			body: { statusCode: status, message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('makeCloudlayerRequest', () => {
	it('turns a 201 plan refusal into an ApiError with the provider reason', async () => {
		// Live answer from POST /v2/storage on the free plan (11-13).
		mockedRequest.mockResolvedValue({
			allowed: false,
			reason:
				'User Storage not supported by current plan, upgrade plan to use User Storage.',
			statusCode: 401,
		});

		// `unknown` because a rejection value has no static type; the assertions
		// below narrow it to ApiError.
		const error = await makeCloudlayerRequest('/storage', 'unit-test-key', {
			method: 'POST',
			body: { title: 'corsair-plugin-test' },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		expect(error.status).toBe(401);
		expect(error.message).toBe(
			'User Storage not supported by current plan, upgrade plan to use User Storage.',
		);
	});

	it('keeps Retry-After on the ApiError from the real transport', async () => {
		const actualRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		mockedRequest.mockImplementation((config, options, requestOptions) =>
			actualRequest(config, options, requestOptions),
		);
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'Too Many Requests' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);

		// `unknown` because a rejection value has no static type; the assertion
		// below narrows it to ApiError.
		const error = await makeCloudlayerRequest('/jobs', 'unit-test-key').catch(
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected the transport to throw ApiError');
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.retryAfter).toBe(4000);
		expect(error.isRateLimitError()).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 2, headersRetryAfterMs: 4000 });
	});

	it('uses X-API-Key on v2 requests and forwards method, body, and query', async () => {
		mockedRequest.mockResolvedValue({ id: 'job-1', status: 'pending' });

		await makeCloudlayerRequest('/html/pdf', 'unit-test-key', {
			method: 'POST',
			body: { html: 'encoded-html', async: true },
			query: { dryRun: false },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CLOUDLAYER_API_BASE,
			HEADERS: {
				'X-API-Key': 'unit-test-key',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual({
			method: 'POST',
			url: '/html/pdf',
			body: { html: 'encoded-html', async: true },
			mediaType: 'application/json; charset=utf-8',
			query: { dryRun: false },
		});
	});

	it('sends multipart form parts without overriding the browser boundary', async () => {
		mockedRequest.mockResolvedValue({ id: 'job-2', status: 'pending' });
		const template = new Blob(['<h1>Invoice</h1>'], { type: 'text/html' });

		await makeCloudlayerRequest('/template/pdf', 'unit-test-key', {
			method: 'POST',
			formData: {
				template,
				data: JSON.stringify({ invoiceNumber: 'INV-2' }),
			},
		});

		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CLOUDLAYER_API_BASE,
			HEADERS: { 'X-API-Key': 'unit-test-key' },
		});
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Content-Type',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/template/pdf',
			formData: {
				template,
				data: '{"invoiceNumber":"INV-2"}',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[1]).not.toHaveProperty('body');
		expect(mockedRequest.mock.calls[0]?.[1]).not.toHaveProperty('mediaType');
	});

	it('uses the v1 base URL for the documented legacy jobs list', async () => {
		mockedRequest.mockResolvedValue([]);

		await makeCloudlayerRequest('/jobs', 'unit-test-key', {
			method: 'GET',
			apiVersion: 'v1',
			query: { limit: 10, startAfterId: 'job-0' },
		});

		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CLOUDLAYER_API_V1_BASE,
			HEADERS: { [CLOUDLAYER_API_KEY_HEADER]: 'unit-test-key' },
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/jobs',
			query: { limit: 10, startAfterId: 'job-0' },
		});
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		await expect(makeCloudlayerRequest('/account', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rethrows 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockedRequest.mockRejectedValue(rateLimited);

		await expect(
			makeCloudlayerRequest('/jobs', 'unit-test-key'),
		).rejects.toMatchObject({ status: 429, retryAfter: 3000 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({ maxRetries: 2, headersRetryAfterMs: 3000 });
	});

	it('drops the submitted body and form data from a transport ApiError', async () => {
		const failed = new ApiError(
			{
				method: 'POST',
				url: '/storage',
				body: {
					title: 'bucket',
					accessKeyId: 'private-access-key',
					secretAccessKey: 'private-secret-key',
				},
				formData: { html: '<p>private-html</p>' },
			},
			{
				url: 'https://api.cloudlayer.io/v2/storage',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { statusCode: 429, message: 'Too Many Requests' },
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);
		mockedRequest.mockRejectedValue(failed);

		const error = await makeCloudlayerRequest('/storage', 'unit-test-key', {
			method: 'POST',
			body: { title: 'bucket' },
			// `unknown` because a rejection value has no static type; the
			// assertions below narrow it to ApiError.
		}).catch((caught: unknown) => caught);
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		const serialized = JSON.stringify(error);
		expect(serialized).not.toContain('private-secret-key');
		expect(serialized).not.toContain('private-access-key');
		expect(serialized).not.toContain('private-html');
		expect(error).toMatchObject({ status: 429, retryAfter: 2000 });
		expect(error.request).toMatchObject({ method: 'POST', url: '/storage' });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('keeps a signed capture URL out of a quick-route ApiError', async () => {
		const captureUrl =
			'https://bucket.example.com/page.html?X-Amz-Signature=private-signature-123';
		const failed = new ApiError(
			{
				method: 'GET',
				url: '/url/pdf',
				query: { url: captureUrl, timeout: 30 },
			},
			{
				url: `https://api.cloudlayer.io/v2/url/pdf?url=${encodeURIComponent(captureUrl)}`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { statusCode: 429, message: 'Too Many Requests' },
			},
			'Too Many Requests',
			{ retryAfter: 1000 },
		);
		mockedRequest.mockRejectedValue(failed);

		const error = await makeCloudlayerRequest('/url/pdf', 'unit-test-key', {
			method: 'GET',
			query: { url: captureUrl, timeout: 30 },
			// `unknown` because a rejection value has no static type.
		}).catch((caught: unknown) => caught);
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		const serialized = JSON.stringify(error);
		expect(serialized).not.toContain('private-signature-123');
		expect(error.url).toBe(`${CLOUDLAYER_API_BASE}/url/pdf`);
		expect(error.request).toEqual({ method: 'GET', url: '/url/pdf' });
		expect(error).toMatchObject({ status: 429, retryAfter: 1000 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('keeps only status fields and a redacted message from a provider error body', async () => {
		const failed = new ApiError(
			{ method: 'POST', url: '/html/pdf' },
			{
				url: 'https://api.cloudlayer.io/v2/html/pdf',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {
					statusCode: 400,
					status: 'error',
					message: 'Invalid template near <p>private-html-body</p>',
					request: { html: '<p>private-html-body</p>', password: 'pw-secret' },
				},
			},
			'Invalid template near <p>private-html-body</p>',
		);
		mockedRequest.mockRejectedValue(failed);

		const error = await makeCloudlayerRequest('/html/pdf', 'unit-test-key', {
			method: 'POST',
			body: { html: '<p>private-html-body</p>', password: 'pw-secret' },
			// `unknown` because a rejection value has no static type.
		}).catch((caught: unknown) => caught);
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		const serialized = JSON.stringify({ ...error, message: error.message });
		expect(serialized).not.toContain('private-html-body');
		expect(serialized).not.toContain('pw-secret');
		expect(error.body).toEqual({
			statusCode: 400,
			status: 'error',
			message: 'Invalid template near [REDACTED]',
		});
		expect(error.message).toBe('Invalid template near [REDACTED]');
		expect(error.status).toBe(400);
	});

	it('uses the bounded sync timeout and parses the documented v2 job response', async () => {
		const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(Response.json({ id: 'job-1', status: 'success' }));

		const result = await makeCloudlayerSyncRequest(
			'/html/pdf',
			'unit-test-key',
			{
				method: 'POST',
				body: { html: 'encoded-html', async: false },
				apiVersion: 'v2',
			},
		);

		expect(result).toEqual({ id: 'job-1', status: 'success' });
		expect(timeoutSpy).toHaveBeenCalledWith(CLOUDLAYER_SYNC_TIMEOUT_MS);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			'https://api.cloudlayer.io/v2/html/pdf',
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('returns v1 file bytes as a base64 artifact', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0x25, 0x50, 0x44, 0x46]), {
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);

		const result = await makeCloudlayerSyncRequest(
			'/html/pdf',
			'unit-test-key',
			{
				method: 'POST',
				apiVersion: 'v1',
				body: { html: 'encoded-html' },
			},
		);

		expect(result).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			'https://api.cloudlayer.io/v1/html/pdf',
		);
		expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': 'unit-test-key',
			},
			body: '{"html":"encoded-html"}',
			credentials: 'omit',
		});
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('adapts a raw v2 response as a binary artifact if the provider returns one', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0x25, 0x50, 0x44, 0x46]), {
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);

		await expect(
			makeCloudlayerSyncRequest('/html/pdf', 'unit-test-key', {
				method: 'POST',
				apiVersion: 'v2',
				body: { html: 'encoded-html', async: false },
			}),
		).resolves.toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
		});
	});

	it('preserves safe JSON provider errors without echoing request data or keys', async () => {
		const apiKey = 'unit-test-private-key';
		const html = 'private-document-marker';
		const consoleError = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});
		const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			Response.json(
				{
					statusCode: 400,
					message: `Invalid HTML ${html}; key ${apiKey}`,
					input: { html },
				},
				{ status: 400, statusText: 'Bad Request' },
			),
		);

		// `unknown` because a rejection value has no static type; the assertion
		// below narrows it to ApiError.
		const error = await makeCloudlayerSyncRequest('/html/pdf', apiKey, {
			method: 'POST',
			body: { html, async: false },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected sync request to throw ApiError');
		}
		expect(error.message).toBe('Invalid HTML [REDACTED]; key [REDACTED]');
		expect(error.body).toEqual({
			statusCode: 400,
			message: 'Invalid HTML [REDACTED]; key [REDACTED]',
		});
		expect(JSON.stringify(error.body)).not.toContain(html);
		expect(JSON.stringify(error.body)).not.toContain(apiKey);
		expect(error.request).toEqual({ method: 'POST', url: '/html/pdf' });
		expect(consoleError).not.toHaveBeenCalled();
		expect(consoleLog).not.toHaveBeenCalled();
	});

	it('redacts short sensitive field values echoed by the provider', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				Response.json(
					{ statusCode: 400, message: 'Invalid password abc123 for page 1' },
					{ status: 400, statusText: 'Bad Request' },
				),
			);

		// `unknown` because a rejection value has no static type; the
		// assertions below narrow it to ApiError.
		const error = await makeCloudlayerSyncRequest(
			'/template/pdf',
			'unit-test-key',
			{
				method: 'POST',
				body: { template: 'invoice', data: { password: 'abc123' } },
			},
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected sync request to throw ApiError');
		}
		expect(error.message).toBe('Invalid password [REDACTED] for page 1');
	});

	it('uses the v1 URL route and preserves retry-after on binary errors', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('rate limited', {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'Retry-After': '2' },
			}),
		);
		const url = 'https://capture.invalid/report?view=full';

		// Fetch rejections are untyped at runtime; narrow to ApiError below.
		const error = await makeCloudlayerSyncRequest(
			'/url/image',
			'unit-test-key',
			{
				method: 'GET',
				apiVersion: 'v1',
				query: { url, timeout: 5000 },
			},
		).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected sync request to throw ApiError');
		}
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		expect(error.body).toBeUndefined();
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2000,
		});

		const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(requestUrl.origin).toBe('https://api.cloudlayer.io');
		expect(requestUrl.pathname).toBe('/v1/url/image');
		expect(requestUrl.searchParams.get('url')).toBe(url);
		expect(requestUrl.searchParams.get('timeout')).toBe('5000');
	});
});
